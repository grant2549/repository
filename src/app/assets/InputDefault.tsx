import IconLock1 from "./IconLock1";
import IconEmail from "./IconEmail";
import IconLock from "./IconLock";

export default function InputDefault(props: InputDefaultProps) {
    return (
        <>
            <div
                className={`font-inter inline-flex flex-col items-start gap-2 self-stretch text-left font-medium ${props.className}`}
            >
                <p
                    className={`text-xs leading-4 text-white transition-all ${
                        props.type === "TYPE1" ? "w-[57px]" : ""
                    } ${props.type === "TYPE2" ? "w-[106px]" : ""} ${
                        props.type === "TYPE" ? "w-[114px]" : ""
                    }`}
                >
                    {props.text}
                </p>
                <div
                    className="flex h-10 w-full items-center justify-center self-stretch text-[#98989E]"
                >
                    <div
                        className="flex h-full w-full items-center justify-between gap-2 rounded-3xl py-3 pl-3 transition-all [box-shadow-width:1px] [box-shadow:0px_0px_0px_1px_rgba(216,_216,_216,_1)_inset]"
                    >
                        {props.type === "TYPE2" && (
                            <IconLock1 className="h-4 w-4" />
                        )}
                        {props.type === "TYPE" && (
                            <IconEmail className="h-4 w-4" />
                        )}
                        {props.type === "TYPE1" && (
                            <IconLock className="h-4 w-4" />
                        )}
                        <p
                            className={`h-4 flex-grow text-xs leading-4 transition-all ${
                                props.type === "TYPE" ? "w-[152px]" : ""
                            } ${props.type === "TYPE2" ? "w-[82px]" : ""} ${
                                props.type === "TYPE1" ? "w-[82px]" : ""
                            }`}
                        >
                            {props.text1}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

InputDefault.defaultProps = {
    className: "",
    type: "TYPE",
    text: "E-Mail or Username",
    text1: "e.g.: elonmusk@mars.com",
};

interface InputDefaultProps {
    className: string;
    type: "TYPE" | "TYPE1" | "TYPE2";
    text: string;
    text1: string;
}

/**
 * This component was generated from Figma with FireJet.
 * Learn more at https://www.firejet.io
 *
 * README:
 * The output code may look slightly different when copied to your codebase. To fix this:
 * 1. Include the necessary fonts. The required fonts are imported from public/index.html
 * 2. Include the global styles. They can be found in App.css
 *
 * Note: Step 2 is not required for tailwind.css output
 */
