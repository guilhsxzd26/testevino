"use client";

import { PointerEvent, ReactNode, useRef } from "react";

export default function DraggableRail({children,className=""}:{children:ReactNode;className?:string}){
  const ref=useRef<HTMLDivElement>(null);
  const drag=useRef({down:false,x:0,left:0,moved:false});

  const onDown=(e:PointerEvent<HTMLDivElement>)=>{
    const el=ref.current;if(!el)return;
    drag.current={down:true,x:e.clientX,left:el.scrollLeft,moved:false};
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
  };
  const onMove=(e:PointerEvent<HTMLDivElement>)=>{
    if(!drag.current.down||!ref.current)return;
    const dx=e.clientX-drag.current.x;
    if(Math.abs(dx)>4)drag.current.moved=true;
    ref.current.scrollLeft=drag.current.left-dx;
  };
  const onUp=(e:PointerEvent<HTMLDivElement>)=>{
    drag.current.down=false;
    ref.current?.classList.remove("dragging");
    try{ref.current?.releasePointerCapture(e.pointerId)}catch{}
  };
  const onClickCapture=(e:React.MouseEvent<HTMLDivElement>)=>{
    if(drag.current.moved){e.preventDefault();e.stopPropagation();drag.current.moved=false}
  };

  return <div
    ref={ref}
    className={"dragRail "+className}
    onPointerDown={onDown}
    onPointerMove={onMove}
    onPointerUp={onUp}
    onPointerCancel={onUp}\n    onDragStart={e=>e.preventDefault()}
    onClickCapture={onClickCapture}
  >{children}</div>
}
