import "./styles.css";
import { useEffect, useRef, useState, useMemo } from "react";

const ellipsisStr = "...";

function TextEllipsis(props) {
  const ref = useRef();
  const premitiveStr = props.children;
  const [boxWidth, setBoxWidth] = useState(0);

  const ctx = useMemo(() => {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ref.current) return ctx;
    const computedStyle = getComputedStyle(ref.current);
    const fontSize = computedStyle.fontSize;
    const fontFamily = computedStyle.fontFamily;

    ctx.font = `${fontSize} ${fontFamily}`;
    return ctx;
  }, [ref.current]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current?.clientWidth;
    setBoxWidth(width);
  }, []);

  const textWidth = useMemo(() => ctx.measureText(premitiveStr).width, [
    premitiveStr,
    ctx
  ]);

  const renderText = useMemo(() => {
    if (!premitiveStr) return;
    if (boxWidth > textWidth) return premitiveStr;
    const strLength = premitiveStr.length;

    let headPos = 0;
    let lastPos = 1;
    let headStr = "";
    let lastStr = "";

    while (true) {
      const isFormHead =
        ctx.measureText(headStr).width < ctx.measureText(lastStr).width;

      const currentStr = isFormHead
        ? premitiveStr[headPos]
        : premitiveStr[strLength - lastPos];

      const resultStr = headStr + ellipsisStr + lastStr;
      if (ctx.measureText(resultStr + currentStr).width > boxWidth) {
        return resultStr;
      }

      if (isFormHead) {
        headStr = headStr + currentStr;
        headPos += 1;
      } else {
        lastStr = currentStr + lastStr;
        lastPos += 1;
      }
    }
  }, [premitiveStr, boxWidth, textWidth, ctx]);

  return <div ref={ref}>{renderText}</div>;
}

export default function App() {
  const str = "这是一段还有一点问题，看看他会11111111";
  return (
    <div className="App">
      <div className="box" title={str}>
        <TextEllipsis>{str}</TextEllipsis>
      </div>
    </div>
  );
}
