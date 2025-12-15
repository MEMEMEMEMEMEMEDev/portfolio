const ArrowSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={8}
    fill="none"
    {...props}
    className={props.className}
  >
    <path
      stroke="#000000ff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m1.294 7.393 6.048-6.048M8.138 5.353V.55H3.335"
    />
  </svg>
);
export default ArrowSVG;
