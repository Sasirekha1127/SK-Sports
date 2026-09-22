import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Product() {
    const [products, setProducts] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        fetch(`${apiUrl}/products`)
            .then(r => r.json())
            .then(data => {
                if(data && Array.isArray(data)) {
                    setProducts(data.slice(0, 4));
                }
            })
            .catch(console.error);
    }, [apiUrl]);

return (
<>
<div className="tf-widget-product main-content background-grey">
<div className="themeflat-container">
<div className="tf-product">
<div className="title-box-v2 title-large center-title-box">
<h2 className="title-section wow fadeInUp animated">Product</h2>
</div>
<div className="row">
                            {products.length > 0 ? products.map((p, index) => (
<div className="col-12 col-sm-6 col-md-6 col-lg-3" key={index}>
<div className="product-item-v1 wow fadeInUp animated">
<div className="product-image">
<img src={p.image || "images/product/1.jpg"} alt={p.title} />
</div>
<div className="product-content">
<h6 className="title-product"><Link to="/#">{p.title}</Link></h6>
<div className="category-product"><Link to="/#">{p.category}</Link></div>
<div className="price">
                                            {p.salePrice ? (
                                                <>
                                                <span className="price-sale">₹{p.salePrice}</span>
                                                <span className="price-product" style={{textDecoration:'line-through', marginLeft:'8px'}}>₹{p.price}</span>
                                                </>
                                            ) : (
                                                <span className="price-sale">₹{p.price}</span>
                                            )}
                                        </div>
</div>
</div>
</div>
                            )) : null}
</div>
</div>
</div>
</div>
</>
)
}


