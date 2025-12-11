import { Link } from "react-router-dom";

export function ToyPreview({ toy, onRemoveToy, onEditToy }) {

    return (
        <article className="toy-preview">
            <h4>{toy.name}</h4>
            <img src={toy.imgUrl} alt={toy.name} />
            <p>Price: <span>${(toy.price || 0).toLocaleString()}</span></p>
            <p>In Stock: <span>{toy.inStock ? 'Yes' : 'No'}</span></p>
            <p>Labels: <span>{toy.labels?.join(', ') || 'No labels'}</span></p>
            <p>Created At: <span>{toy.createdAt ? new Date(toy.createdAt).toLocaleString() : 'N/A'}</span></p>
            <div className="toy-preview-buttons">
            <button title="Remove Toy" onClick={() => onRemoveToy(toy._id)}>x</button>
                <button onClick={() => onEditToy(toy)}>Edit</button>
                <Link to={`/toy/${toy._id}`} className="btn-link">Details</Link>
            </div>
        </article>
    )
}