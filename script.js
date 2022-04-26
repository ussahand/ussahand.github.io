/************ global variables for scroller *************/
let gc = 0;
let gActive = false;

const gKeyVal={
  ArrowRight: +1,
  ArrowLeft: -1,
  ArrowUp: +1,
  ArrowDown: -1,
}
const gslider = document.getElementById("slid");
const gknob = document.getElementById("knob");
const gsliderStyle = window.getComputedStyle(gslider, null);
const gknobStyle = window.getComputedStyle(gknob, null);
const gnumerator = document.getElementById("numerator");
const gdenominator = document.getElementById("denominator")
const gpages = document.querySelectorAll(".contents > div , .contents section > div");

const updateScroll = (e , step = 0, src = '' ) => {
  // e.preventDefault();
  const maxRange = gpages.length;
  const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape' ;
  const crntSlidVal = Number( slidValue.innerText ) ;
  const segmentX = ( parseInt(gsliderStyle.width) - parseInt(gknobStyle.width) ) / (maxRange - 1) ;
  const segmentY = ( parseInt(gsliderStyle.height) - parseInt(gknobStyle.height) ) / (maxRange - 1) ;
  
  if( src === "mousemove" )
    if( orientation == "portrait" )
      step = e.x > segmentX * crntSlidVal ? 1  // X-axis step forward
            : e.x < segmentX * ( crntSlidVal - 1 ) ? -1 : 0; // X-axis step backward
    else
      step = e.y > segmentY * crntSlidVal ? 1  // Y-axis step forward
            : e.y < segmentY * ( crntSlidVal - 1 ) ? -1 : 0; // Y-axis step backward
  
  const next = ( crntSlidVal - 1 + step + maxRange ) % (maxRange) ;
  slidValue.innerText = next+1; // slider start from 1 not 0

  orientation === 'portrait'       // update knobs left and top coordination 
    ?  knob.style.left =  segmentX * next + "px"  
    :  knob.style.top =  segmentY * next + "px";

  gnumerator.innerText = next+1;
  gdenominator.innerText = maxRange;

  // change the order of flexbox items
 // gpages.forEach( (p,i) => p.style.order =  i == next ? -1 : 0 );
  window.location.href = "#" + gpages[next].id ;
}

/********** scroller events *************/
window.onload = updateScroll;

window.onresize = ()=> {
  // console.log( window.innerWidth, window.innerHeight, window.scrollMaxX,window.scrollMaxY);
  /*if window resize without orientation change and think about knob is in the
  right most or bottom side, scroll box will update with css but
  top and left are not in css, so they stuck in their position and browser will add scroll
  by window.scrollMaxX and Y, so we should update them again.*/
  updateScroll();
}


/************* keyboad and mouse events ********/
gslider.addEventListener("change", updateScroll); /* for range slider*/
gslider.addEventListener("mousedown", ()=> gActive = true );
window.addEventListener("mouseup", ()=> gActive = false );
gknob.addEventListener("mousemove", (e)=> gActive && updateScroll(e, 0, "mousemove") )
sliderBox.addEventListener("mousemove", (e)=> gActive && updateScroll(e, 0, "mousemove") )
window.addEventListener("wheel", (e)=> updateScroll(e, Math.sign(e.deltaX + e.deltaY )) );
window.addEventListener("keydown", (e)=> gKeyVal.hasOwnProperty(e.code) && updateScroll(e , gKeyVal[e.code], "keydown" ) );


/*************** touch events ***********************/

let gstart;
let gend;
const content = document.getElementById("contentBox");
content.ontouchstart = (e)=> gstart = { x: e.touches[0].clientX , y: e.touches[0].clientY };
content.ontouchmove = (e)=> gend = { x: e.touches[0].clientX , y: e.touches[0].clientY };
content.ontouchend = () => {
  const deltaX = parseInt( gend.x - gstart.x );
  const deltaY = parseInt( gend.y - gstart.y );
  const step = Math.sign(deltaX +deltaY);
  updateScroll( null, step );
};

gslider.ontouchmove = (e)=> {
  cordination = { x: e.touches[0].clientX , y: e.touches[0].clientY };
  updateScroll( cordination, 0, "mousemove");
}

/*************** Update scroller by clicking navbar anchers ********** */
updateSlidByAncher = (e)=>{
  gpages.forEach( (p,i) => 
       e.target.hash == '#'+p.id ? slidValue.innerText = i+1 : ()=>{}  ); 
  updateScroll();
}

document
  .querySelectorAll("nav a")
  .forEach( p => p.addEventListener("click", updateSlidByAncher) );

// slidValue.innerText = 3; /*initial page*/

// console.clear();
// function __CodePenIFrameAddedToPage() {
//   const pen = document.querySelectorAll(".codepen");
//   console.log( pen.length );

// }