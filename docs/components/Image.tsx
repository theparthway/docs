export default function Image({
    imageURL,
    height,
    width,
    align,
}: {
    imageURL: string;
    height?: number;
    width?: number;
    align?: "center";
}) {
    return (
        <div align={align}>
            <img src={imageURL} alt="img" height={height} width={width} />
        </div>
    );
}
