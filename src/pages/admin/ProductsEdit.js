import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../../context/MainContext';

function EditProduct() {
    const { setLoading, setMessage } = useContext(MainContext);
    const [data, setData] = useState({
        name: '',
        sku: '',
        photo: '',
        warehouse_qty: '',
        price: '',
        categories: []
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);

        axios.get('http://localhost:8000/api/products/' + id)
        .then(resp => setData(resp.data))
        .finally(() => setLoading(false));

        axios.get('http://localhost:8000/api/categories')
        .then(resp => setCategories(resp.data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        //const data = new FormData(e.target);

        //Su Fetch Funkcija
        // fetch('http://localhost:8000/api/products/' + id, {
        //     body: data,
        //     method: 'PUT'
        // })
        // .then(resp => resp.text())
        // .then(resp => console.log(resp));

        setLoading(true);
        
        axios.put('http://localhost:8000/api/products/' + id, data)
        .then(resp => {
            setMessage({m: resp.data, s: 'success'});
            setTimeout(() => navigate('/admin'), 2000);
        })
        .catch(error => {
            setMessage({m: error.response.data, s: 'danger'})
        })
        .finally(() => setLoading(false));
    }

    const handleField = (e) => {
        console.log(data);
        if(e.target.name === 'categories') {
            if(e.target.checked) {
                data.categories.push(e.target.value);
            } else {
                const index = data.categories.indexOf(e.target.value);
                data.categories.splice(index, 1);
            }
            
            return setData({...data});
        }
        
        setData({...data, [e.target.name] : e.target.value});
        
    }

    return (
        <>
            <h1>Redaguoti produktą</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Pavadinimas</label>
                    <input 
                        type="text" 
                        name="name" 
                        className="form-control" 
                        required 
                        value={data.name} 
                        onChange={handleField}
                    />
                </div>
                <div className="mb-3">
                    <label>SKU</label>
                    <input 
                        type="text" 
                        name="sku" 
                        className="form-control" 
                        required 
                        value={data.sku} 
                        onChange={handleField}
                    />
                </div>
                <div className="mb-3">
                    <label>Photo</label>
                    <input 
                        type="text" 
                        name="photo" 
                        className="form-control" 
                        required 
                        value={data.photo} 
                        onChange={handleField}
                    />
                </div>
                <div className="mb-3">
                    <label>Likutis sandėlyje</label>
                    <input 
                        type="number" 
                        name="warehouse_qty" 
                        className="form-control" 
                        required 
                        value={data.warehouse_qty} 
                        onChange={handleField}
                    />
                </div>
                <div className="mb-3">
                    <label>Kaina</label>
                    <input 
                        type="number" 
                        name="price" 
                        step="0.01" 
                        className="form-control" 
                        required 
                        value={data.price} 
                        onChange={handleField}
                    />
                </div>
                <div className="mb-3">
                    {categories.map(item => 
                        <div key={item.id}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="categories" 
                                    className="form-check-input me-2" 
                                    value={item.id} 
                                    onChange={handleField}
                                    checked={data.categories.find(el => el.id === item.id)}
                                />
                                {item.name}
                            </label>
                        </div>    
                    )}
                </div>
                <button className="btn btn-primary">Išsaugoti</button>
            </form>
        </>
    );
}

export default EditProduct;