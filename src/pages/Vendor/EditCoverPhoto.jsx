
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Wrapper from "./Wrapper";
import { MdFileUpload } from "react-icons/md";
import image from "../../assets/Images/Navneegt.jpeg";

// import { deleteProduct } from "../../Store/ActionCreators/ProductActionCreators";
import { useDispatch, useSelector } from "react-redux";
// import { apiLink } from "../../utils/utils";
// import { getVendorProductAPI } from "../../Store/Services/ProductService";


export default function VendorProduct() {
  var dispatch = useDispatch();
  const [allproducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().getTime());
  const limit = 20;
//   function getAPIData() {
//     getVendorProductAPI(page, search).then((data) => {
//       setAllProducts(data?.data || []);
//       setCount(data?.count || 0);
//     });
//   }
//   useEffect(() => {
//     getAPIData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [date]);

  return (
    // <Wrapper>
      <div className="box__layout">
        <div className="header__layout">
          <div className="row">
            <h3 className="flex-1">Products</h3>
            <div className="col-md-3 text-right">
              <Link to="/vendor-add-product" className="add__item">
                <span className="fa fa-plus mr-2"></span> Add Product
              </Link>
            </div>
          </div>
        </div>
        <div className="ui__form position-relative search_product">
          <label htmlFor="name" className="ui_form_label">
            Search Product
          </label>
          <input
            id="name"
            name="name"
            placeholder=""
            className="ui_form_field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="ui_form_button"
            onClick={() => {
              setDate(new Date().getTime());
            }}
          >
            Search
          </button>
        </div>
        {allproducts.length == 0 && (
          <div className="alert alert-danger">No products</div>
        )}
        <div className="row">
          {allproducts.map((item) => (
            <div className="col-md-3" key={item._id}>
              <div className="product__item">
                <div
                  className="product_item_image"
                  style={{
                    backgroundImage: item.image ? `url(${image}/products/${image})` : 'url(https://via.placeholder.com/150x150?text=No+Image)',
                  }}
                ></div>
                <div className="product_item_content text-left">
                  <h4 title={item.name}>{item.name}</h4>
                  <p>
                    <span>Color:</span> {item.color}
                  </p>
                  <div className="product_item_actions">
                    <Link to={"/vendor-update-product/" + item._id}>
                      <i className="fa fa-edit"></i> Edit
                    </Link>
                    <Link to={"/single-product/" + item._id} target="_blank">
                      <i className="fa fa-eye"></i> View
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are Your Sure You Want to Delete that Item :"
                          )
                        ) {
                          dispatch(deleteProduct({ _id: item._id }));
                        }
                      }}
                    >
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pagination__items">
            <button
              onClick={() => {
                setPage(page - 1);
                setDate(new Date().getTime());
              }}
              disabled={page <= 0}
            >
              Previous
            </button>
            <button
              onClick={() => {
                setPage(page + 1);
                setDate(new Date().getTime());
              }}
              disabled={page >= Math.ceil(count / limit) - 1}
            >
              Next
            </button>
          </div>
        </div>
        {/* <div style={{ height: 400, width: "100%" }}>
          <DataGrid
                getRowId={(row) => row._id}
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
        </div> */}
      </div>
    // </Wrapper>
  );
}