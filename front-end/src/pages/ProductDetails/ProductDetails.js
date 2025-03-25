import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductService from "../../services/api/ProductService";
import Gallery from "../../components/Pictures/Gallery";
import "./image.css"
import Review from "../../components/Review/Review";
const tabs = [
  {
    id: "Fiche Technique",
    key: "Fiche Technique",
  },
  {
    id: "Description",
    key: "Description",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis.",
  }

];

const ProductDetails = () => {
  const location = useLocation();
  const { _id } = useParams();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await ProductService.getProductById(_id);
      setProductInfo(product);
    };

    if (location.state && location.state.item) {
      setProductInfo(location.state.item);
    } else {
      fetchProduct();
    }
    setPrevLocation(location.pathname);
  }, [location, _id]);

  if (!productInfo) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or component
  }

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full xl:col-span-2">
            {/* <img
              className="w-full h-full "
              src={productInfo.img}
              alt={productInfo.img}
            /> */}
            <div className="image">
              <section className="core">
                <Gallery images={productInfo.images} />
              </section>
            </div>

          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-4 xl:px-4 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
        <div>
          <div className=" space-x-4  pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
                  } py-2 px-4  focus:outline-none`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.key}
              </button>
            ))}
          </div>
          <div className="my-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? "" : "hidden"}
              >
                {tab.id === "Fiche Technique" && productInfo.specs ? (
                  <div>
                    <table className="table-auto w-full">
                      <tbody>
                        {productInfo.specs.map((row) => (
                          <tr key={row.key} className="bg-gray-100">
                            <td className="border px-4 py-2 font-semibold">
                              {row.key}
                            </td>
                            <td className="border px-4 py-2">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  tab.id === "Description" ? (
                    <p>{productInfo.description}</p>
                  ) : (
                    tab.content
                  )
                )}
              </div>
            ))}
          </div>
        </div>
        <Review />
      </div>
    </div>
  );
};

export default ProductDetails;
