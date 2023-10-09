interface FloorProps {
  Width: string;
  Height: string;
}

const Floor: React.FC<FloorProps> = ({ Width, Height }) => {
  const containerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(126, 130, 135, 0.44) 2.64%, rgba(66, 69, 73, 0.00) 102.5%)',
    width: Width,
    height: Height,
  };

  return (
    <div style={containerStyle}>
    </div>
  );
};

export default Floor;
