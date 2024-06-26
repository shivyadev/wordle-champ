import Icons from "./Icons";

export default function ErrorMessage({dispErrMsg, msg}) {
    return (
        <section className="flex text-sm text-red-400">
            <Icons iconName={'info'} styles="w-5 h-5"/>
            <span className="ml-1">{msg}</span>
        </section>
    );

}