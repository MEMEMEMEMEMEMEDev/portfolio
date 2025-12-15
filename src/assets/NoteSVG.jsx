const NoteSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={13}
    fill="none"
    {...props}
  >
    <path
      stroke="rgba(255, 255, 255, .5)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M4 1.066v1.5M8 1.066v1.5M3.5 6.566h4M3.5 8.566H6M8 1.816c1.665.09 2.5.725 2.5 3.075v3.09c0 2.06-.5 3.09-3 3.09h-3c-2.5 0-3-1.03-3-3.09V4.89c0-2.35.835-2.98 2.5-3.075h4Z"
    />
  </svg>
);
export default NoteSVG;
