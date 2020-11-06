document.addEventListener('DOMContentLoaded', ()=>{
  const shoutoutDivs = document.querySelectorAll('.shoutouts');
  shoutoutDivs.forEach(shoutout => {
    const shoutouts = shoutout.querySelectorAll('p');
    const activeShout = document.createElement('p');
    activeShout.className = "shouting";
    activeShout.innerHTML = shoutouts[0].textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    shoutout.appendChild(activeShout);

    let currentShout = 0;

    function animateText() {
      const anim = anime.timeline({loop: false}).add({
          targets: '.shoutouts p.shouting .letter',
          translateX: [40, 0],
          translateZ: 0,
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 1200,
          delay: (el, i) => 500 + 30 * i
        }).add({
          targets: '.shoutouts p.shouting .letter',
          translateX: [0, -40],
          opacity: [1, 0],
          easing: "easeInExpo",
          duration: 500,
          delay: (el, i) => 2000 + 20 * i
        });
      anim.finished.then(()=>{
        currentShout = (currentShout + 1) % shoutouts.length;
        activeShout.innerHTML = shoutouts[currentShout].textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        animateText();
      });
    }

    animateText();
  });
});
