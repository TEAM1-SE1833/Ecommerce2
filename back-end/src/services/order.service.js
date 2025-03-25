const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { getIO } = require('../utils/socket');
const xlsx = require('xlsx');

class OrderService {
    getPaginatedAllOrders = async (page, pageSize, keywords, sortBy) => {
        const skip = (page - 1) * pageSize;
        let filter = {};
        if (keywords) {
            filter['contactInfo.phone'] = keywords;
        }
        let sort = {};
        switch (sortBy) {
            case 'orderStatus': {
                sort.orderStatus = 1;
                break;
            }
            case 'totalPrice': {
                sort.totalPrice = 1;
                break;
            }
        }
        const orders = await Order.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .populate('userId')
            .populate({ path: 'items.productId', strictPopulate: false })
            .lean();
        const totalOrders = await Order.countDocuments(filter);
        return {
            orders,
            totalOrders,
            totalPages: Math.ceil(totalOrders / pageSize),
            currentPage: page,
        };
    }

    async createOrder(req) {
        try {
            let { userId, items, contactInfo, shippingFee } = req.body;
            if (!userId || userId.trim() === '') {
                userId = null;
            }
            if (!shippingFee) {
                shippingFee = 0;
            }
            const totalPrice = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0) + shippingFee;
            
            const newOrder = new Order({
                userId,
                items,
                totalPrice,
                shippingFee,
                paymentMethod: 'Cash On Delivery',
                contactInfo,
                orderStatus: 'Pending',
                paymentStatus: 'Pending'
            });

            const order = await newOrder.save();
            const io = getIO();
            io.emit('newOrder', order);
            return order;

        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Internal Server Error');
        }
    }

    async validateOrderItems(items) {
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            const colorStock = product.inStock.find(stock => stock.color === item.color);
            if (!colorStock) {
                throw new Error(`Color ${item.color} not available for product ID ${item.productId}`);
            }

            if (colorStock.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ID ${item.productId} and color ${item.color}`);
            }
            if (item.salePrice !== product.price) {
                throw new Error(`Sale price ${item.salePrice} does not match product price ${product.price} for product ID ${item.productId}`);
            }

            if (item.saleCost !== product.cost) {
                throw new Error(`Sale cost ${item.saleCost} does not match product cost ${product.cost} for product ID ${item.productId}`);
            }
        }
    }

    async updateProductStock(items) {
        for (const item of items) {
            const product = await Product.findById(item.productId);
            const colorStock = product.inStock.find(stock => stock.color === item.color);

            if (colorStock) {
                colorStock.quantity -= item.quantity;
                if (colorStock.quantity < 0) colorStock.quantity = 0;
            }

            await product.save();
        }
    }

    async getOrderById(orderId) {
        try {
            return await Order.findById(orderId).populate('items.productId');
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getTopSellingProducts() {
        try {
            const topSellingProducts = await Order.aggregate([
                { $unwind: '$items' },
                { $match: { paymentStatus: 'Completed' } },
                {
                    $group: {
                        _id: '$items.productId',
                        totalSold: { $sum: '$items.quantity' }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 4 }
            ]);

            const productIds = topSellingProducts.map(item => item._id);
            const products = await Product.find({ _id: { $in: productIds } });

            const result = topSellingProducts.map(item => {
                const product = products.find(p => p._id.equals(item._id));
                return {
                    productId: item._id,
                    totalSold: item.totalSold,
                    productDetails: product
                };
            });

            return result;
        } catch (error) {
            console.error('Error fetching top selling products:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getOrdersByUserId(userId, page, limit, startDate, endDate, orderStatus) {
        try {
            const skip = (page - 1) * limit;
            const query = { userId };

            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                };
            }

            if (orderStatus) {
                query.orderStatus = orderStatus;
            }

            const orders = await Order.find(query)
                .skip(skip)
                .limit(limit)
                .populate('items.productId')
                .sort({ createdAt: -1 });
                
            const totalOrders = await Order.countDocuments(query);
            return {
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: page,
                orders
            };
        } catch (error) {
            console.error('Error fetching orders by user ID:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Internal Server Error'
            };
        }
    }

    async updateOrder(orderId, orderData) {
        try {
            const allowedUpdates = {
                orderStatus: orderData.orderStatus,
                paymentStatus: orderData.paymentStatus,
                contactInfo: orderData.contactInfo
            };
            const updatedOrder = await Order.findByIdAndUpdate(orderId, allowedUpdates, { new: true });
            if (!updatedOrder) {
                throw new Error('Order not found');
            }
            
            // Update payment status to "Completed" when order is delivered for Cash on Delivery
            if (orderData.orderStatus === 'Delivered' && updatedOrder.paymentMethod === 'Cash On Delivery') {
                updatedOrder.paymentStatus = 'Completed';
                await updatedOrder.save();
            }

            const io = getIO();
            io.to(updatedOrder.userId.toString()).emit('orderUpdated', updatedOrder);

            return { message: 'Update order successfully' };
        } catch (error) {
            console.error('Error updating order:', error);
            return { error: 'failed', message: error.message || 'Internal Server Error' };
        }
    }

    async getOrders({ page, limit, search, sort, filter }) {
        try {
            const skip = (page - 1) * limit;
            const query = {};

            if (search) {
                query['$or'] = [
                    { 'contactInfo.name': { $regex: search, $options: 'i' } },
                    { 'contactInfo.email': { $regex: search, $options: 'i' } },
                    { 'contactInfo.phone': { $regex: search, $options: 'i' } }
                ];
            }

            if (filter) {
                if (filter.orderStatus) {
                    query.orderStatus = filter.orderStatus;
                }
                if (filter.paymentStatus) {
                    query.paymentStatus = filter.paymentStatus;
                }
            }

            let sortOptions = {};
            if (sort) {
                sortOptions[sort.field] = sort.order === 'desc' ? -1 : 1;
            } else {
                sortOptions = { createdAt: -1 };
            }

            const orders = await Order.find(query)
                .skip(skip)
                .limit(limit)
                .sort(sortOptions)
                .populate('items.productId', 'name');

            const totalOrders = await Order.countDocuments(query);

            return {
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: page,
                orders
            };
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Internal Server Error');
        }
    }

    async deleteOrder(orderId) {
        try {
            await Order.findByIdAndDelete(orderId);
        } catch (error) {
            console.error('Error deleting order:', error);
            throw new Error('Internal Server Error');
        }
    }


}

module.exports = new OrderService();