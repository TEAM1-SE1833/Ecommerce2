const { OrderService, EmailService } = require('../services/index');

class OrderController {
    async createOrder(req, res) {
        try {
            const order = await OrderService.createOrder(req);
            res.json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getTopSellingProducts(req, res) {
        try {
            const topSellingProducts = await OrderService.getTopSellingProducts();
            res.json(topSellingProducts);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getOrdersByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const { page = 1, limit = 10, startDate, endDate, orderStatus } = req.query;
            const result = await OrderService.getOrdersByUserId(
                userId,
                Number(page),
                Number(limit),
                startDate,
                endDate,
                orderStatus
            );
            res.json(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async updateOrder(req, res) {
        try {
            const { orderId } = req.params;
            const orderData = req.body;
            const updatedOrder = await OrderService.updateOrder(orderId, orderData);
            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getOrder(req, res) {
        try {
            const { orderId } = req.params;
            const order = await OrderService.getOrderById(orderId);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getOrders(req, res) {
        try {
            const { page = 1, limit = 10, search, sortField, sortOrder, orderStatus, paymentStatus } = req.query;

            const filter = {
                orderStatus: orderStatus || undefined,
                paymentStatus: paymentStatus || undefined
            };

            const sort = {
                field: sortField || 'createdAt',
                order: sortOrder || 'desc'
            };

            const result = await OrderService.getOrders({
                page: Number(page),
                limit: Number(limit),
                search,
                sort,
                filter
            });

            res.status(200).json(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async deleteOrder(req, res) {
        try {
            const { orderId } = req.params;
            await OrderService.deleteOrder(orderId);
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }




    getPaginatedAllOrders = async (req, res, next) => {
        try {
            const { page = 1, pageSize = 10, keywords = '', sortBy = '' } = req.query;
            const result = await OrderService.getPaginatedAllOrders(parseInt(page), parseInt(pageSize), keywords, sortBy);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }

}

module.exports = new OrderController();