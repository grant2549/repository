export default function IconEmail(props: IconEmailProps) {
    return (
        <div className={`${props.className}`}>
            <svg
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_225_2700)">
                    <path
                        d="M 14.667 2.667 H 1.333 V 13.334 H 14.667 V 2.667 Z M 13.333 5.334 L 8 8.667 L 2.667 5.334 V 4 L 8 7.334 L 13.333 4 V 5.334 Z"
                        fill="#98989E"
                     />
                </g>
                <defs>
                    <clipPath id="clip0_225_2700">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}

IconEmail.defaultProps = {
    className: "",
};

interface IconEmailProps {
    className: string;
}