const cursorSmall = document.querySelector('.small');
console.log(cursorSmall);



const positionElement = (e)=> {
  const mouseY = e.clientY;
  const mouseX = e.clientX;
   
 // cursorSmall.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

 
}

window.addEventListener('mousemove', positionElement)