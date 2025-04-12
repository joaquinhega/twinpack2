// Informacion de las celdas en AnimatedModal. NO SE USA

const ProductCell = ({
    description,
    quantity,
    price,
    number,
    categoria_nombre,
    observations
}) => {
    return (
            <tr className="product">
                <td data-title="Categoria" className="product_proveedor">{categoria_nombre}</td>
                <td data-title="Descripción" className="product_laboratorio">{description}</td>
                <td data-title="Cantidad" className="product_proveedor">{number}</td>
                <td data-title="Cantidad" className="product_proveedor">{quantity}</td>
                <td data-title="Precio" className="product_proveedor">
                    {price ? Number(price).toFixed(2) : 'N/A'}
                </td>
                <td data-title="Monto" className="product_proveedor">
                    {price && quantity ? (Number(price) * Number(quantity)).toFixed(2) : 'N/A'}
                </td>
                <td data-title="Precio" className="product_proveedor">{observations}</td>
            </tr>
    );
};

export default ProductCell;
