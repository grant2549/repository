export default function IconLock1(props: IconLock1Props) {
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
                <g clipPath="url(#clip0_225_2537)">
                    <path
                        d="M 13.333 5.334 H 11.333 V 4.14 C 11.333 2.4 10.06 0.847 8.327 0.68 C 6.34 0.494 4.667 2.054 4.667 4 V 5.334 H 2.667 V 14.667 H 13.333 V 5.334 Z M 8 11.334 C 7.267 11.334 6.667 10.734 6.667 10 C 6.667 9.267 7.267 8.667 8 8.667 C 8.733 8.667 9.333 9.267 9.333 10 C 9.333 10.734 8.733 11.334 8 11.334 Z M 6 5.334 V 4 C 6 2.894 6.893 2 8 2 C 9.107 2 10 2.894 10 4 V 5.334 H 6 Z"
                        fill="#98989E"
                     />
                </g>
                <defs>
                    <clipPath id="clip0_225_2537">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}

IconLock1.defaultProps = {
    className: "",
};

interface IconLock1Props {
    className: string;
}