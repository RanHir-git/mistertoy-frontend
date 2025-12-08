import { ToyPreview } from "./ToysPreview.jsx"
import { toyService } from "../services/toy.service.js"

export function ToyList({ toys, onRemoveToy, onEditToy }) {
    return (
        <ul className="toy-list clean-list">
            {toys.map(toy =>
                <li className="toy-preview-item" key={toy._id} style={{ border: `solid 5px ${toyService.getToyColor()}` }}>
                    <ToyPreview toy={toy}
                    onRemoveToy={onRemoveToy}
                    onEditToy={onEditToy}
                    />
                </li>)}
        </ul>
    )
}