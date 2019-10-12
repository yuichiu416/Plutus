import React from 'react';
import { Link } from 'react-router-dom';


function Splash() {

  "use strict";
  /**
   * Written by Dillon https://codepen.io/Dillo
   *
   * Inspired in very large part by Alex Andrix's work on Codepen
   * https://codepen.io/alexandrix/pen/jgyWww
   * @author Alex Andrix <alex@alexandrix.com>
   * @since 2019
   */
  const nbEddies = 5;
  const nbParticles = 2000; // number of particles
  const lifeTime = 1000; // average lifetime of particles

  let canv, ctx;   // canvas and drawing context
  let maxx, maxy;  // size of client Window
  let dimx, dimy;  // size of canvas

  let eddies;      // array of eddies
  let particles;   // array of particles

  let requestID;   // ID provided by window.requestAnimationFrame();
  let hueShift;

  /* shortcuts for Math */

  const mrandom = Math.random; // see above alternative function for reproductible results
  const mfloor = Math.floor;
  const mmin = Math.min;
  const mexp = Math.exp;

  const mhypot = Math.hypot;

  //-----------------------------------------------------------------------------
  // miscellaneous functions
  //-----------------------------------------------------------------------------

  function alea(min, max) {
    // random number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') return min * mrandom();
    return min + (max - min) * mrandom();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function intAlea(min, max) {
    // random integer number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') {
      max = min; min = 0;
    }
    return mfloor(min + (max - min) * mrandom());
  } // intAlea

  //------------------------------------------------------------------------
  function createEddy() {

    return {
      x: alea(dimx),
      y: alea(dimy),
      /*    
        x: dimx / 2,
        y: dimy / 2, 
      */
      //   coeffR: 0.0,        // coefficient for radial velocity
      coeffR: 0.001 * (alea(0.7, 1.3)),        // coefficient for radial velocity
      radius: 150 + alea(-50, 50),          // radius where angular velocity is max
      coeffA1: 10000 * alea(0.8, 1.2),         // coefficient in exponent for angular velocity
      coeffA2: 0.01 * alea(0.8, 1.2),       // multiplying coefficient for angular velocity
      dir: (mrandom() > 0.5) ? 1 : -1 // direction of rotation
    }

  } // createEddy

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function createEddies() {
    eddies = [];                  // create empty array;
    for (let k = 0; k < nbEddies; ++k) {
      eddies.push(createEddy());
    } // for k
  } // createEddies

  //------------------------------------------------------------------------
  function createParticle() {

    return {
      x: alea(-100, dimx + 100),
      y: alea(-100, dimy + 100),
      sat: `${intAlea(50, 101)}%`,
      light: `${intAlea(30, 80)}%`,
      TTL: alea(lifeTime * 0.8, lifeTime * 1.2) // time to live
    }
  } // createParticle
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function createParticles() {
    particles = [];                  // create empty array;
    for (let k = 0; k < nbParticles; ++k) {
      particles.push(createParticle());
    } // for k
    particles.forEach(part => {
      part.TTL = intAlea(lifeTime); // to avoid too many deaths / births in firts generations
    });
  } // createParticles

  //------------------------------------------------------------------------
  function move() {

    let part, prev, dx, dy, s, c, r, rv, av, deltar;
    let mindeltar;

    for (let k = 0; k < nbParticles; ++k) {
      part = particles[k];
      // death and re-birth
      if (part.TTL <= 0) {
        part = createParticle();
        particles[k] = part;
      }

      prev = { x: part.x, y: part.y }; // position before this move
      mindeltar = 10000; // used to evaluate hue

      eddies.forEach((eddy, ke) => {
        dx = prev.x - eddy.x;
        dy = prev.y - eddy.y;
        r = mhypot(dx, dy);    // distance particle - centre of the eddy

        if (r < 0.001) r = 0.001;
        s = dy / r; // sine of angle
        c = dx / r; // cosine of angle

        // angular velocity
        deltar = r - eddy.radius;
        av = eddy.coeffA2 * mexp(- deltar * deltar / eddy.coeffA1) * eddy.dir;
        // radial velocity
        rv = - deltar * eddy.coeffR;

        part.x += rv * c - av * r * s;
        part.y += rv * s + av * r * c;

      }) // (loop on eddies)
      --part.TTL; // decrease time to live
      // draw it
      let speed = mhypot(prev.x - part.x, prev.y - part.y);
      let hue = mmin(speed * 100, 300); // hue based on speed
      hue = (hue + hueShift) % 360;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(part.x, part.y);
      ctx.strokeStyle = `hsl(${hue},${part.sat},${part.light})`;
      ctx.stroke();

    } // for k (loop on particles)
  } // move

  //------------------------------------------------------------------------

  //------------------------------------------------------------------------

  function startOver() {

    // canvas dimensions

    maxx = window.innerWidth;
    maxy = window.innerHeight;

    dimx = maxx - 8; // for a small margin around the canvas
    dimy = maxy - 8; // for a small margin around the canvas

    canv.style.left = (maxx - dimx) / 2 + 'px';
    canv.style.top = (maxy - dimy) / 2 + 'px';

    canv.width = dimx;
    canv.height = dimy;

    ctx.lineWidth = 1.5;
    ctx.imageSmoothingEnabled = false;

    hueShift = intAlea(360);
    createEddies();
    createParticles();

    if (typeof requestID == 'number') window.cancelAnimationFrame(requestID);
    (function animate() {
      move();
      requestID = window.requestAnimationFrame(animate);
    })();

  } // startOver

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function clickCanvas() {
    startOver();
  }
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  // beginning of execution

  {
    canv = document.createElement('canvas');
    canv.style.position = "absolute";
    canv.addEventListener('click', clickCanvas);
    document.body.appendChild(canv);
    ctx = canv.getContext('2d');
    canv.style.height = "100%";
    canv.style.backgroundColor = "black";
    canv.style.zIndex = 10;
  } // canvas creation

  startOver();

  window.addEventListener('resize', startOver);

  function removeCanvas() {
    document.getElementsByTagName("canvas")[0].remove();
  }

  return (
    <Link to="/index">
      <div className="Splash splash-body">
        <div className="logo-container">
          <img onClick={removeCanvas} src="Logo4.png" alt="plutus-logo" className="plutus-logo"/>
        </div>
      </div>
    </Link>
  );
}

export default Splash;

