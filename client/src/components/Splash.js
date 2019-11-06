import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
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
const mrandom = Math.random; // see above alternative function for reproductible results
const mfloor = Math.floor;
const mmin = Math.min;
const mexp = Math.exp;

const mhypot = Math.hypot;

class Splash extends Component {
  constructor(props){
    super(props);
    this.clickCanvas = this.clickCanvas.bind(this);
    this.createEddies = this.createEddies.bind(this);
    this.createParticles = this.createParticles.bind(this);
    this.move = this.move.bind(this);
    this.startOver = this.startOver.bind(this);
  }
  componentDidMount(){
    canv = document.createElement('canvas');
    canv.style.position = "fixed";
    canv.addEventListener('click', this.clickCanvas);
    document.body.appendChild(canv);
    ctx = canv.getContext('2d');
    canv.style.height = "100%";
    canv.style.backgroundColor = "black";
    canv.style.zIndex = 10;
    this.startOver();
    window.addEventListener('resize', this.startOver);
  }
  alea(min, max) {
    if (typeof max == 'undefined') return min * mrandom();
      return min + (max - min) * mrandom();
  }

  intAlea(min, max) {
    if (typeof max == 'undefined') {
      max = min; min = 0;
    }
    return mfloor(min + (max - min) * mrandom());
  }

  createEddies() {
    eddies = [];                  // create empty array;
    for (let k = 0; k < nbEddies; ++k) {
      eddies.push(this.createEddy());
    } // for k
  } 

  createEddy() {
    return {
      x: this.alea(dimx),
      y: this.alea(dimy),
          
      coeffR: 0.001 * (this.alea(0.7, 1.3)),        // coefficient for radial velocity
      radius: 150 + this.alea(-50, 50),          // radius where angular velocity is max
      coeffA1: 10000 * this.alea(0.8, 1.2),         // coefficient in exponent for angular velocity
      coeffA2: 0.01 * this.alea(0.8, 1.2),       // multiplying coefficient for angular velocity
      dir: (mrandom() > 0.5) ? 1 : -1 // direction of rotation
    }
  } 

  createParticle() {
    return {
      x: this.alea(-100, dimx + 100),
      y: this.alea(-100, dimy + 100),
      sat: `${this.intAlea(50, 101)}%`,
      light: `${this.intAlea(30, 80)}%`,
      TTL: this.alea(lifeTime * 0.8, lifeTime * 1.2) // time to live
    }
  }

  createParticles() {
    particles = [];                  // create empty array;
    for (let k = 0; k < nbParticles; ++k) {
      particles.push(this.createParticle());
    } // for k
    particles.forEach(part => {
      part.TTL = this.intAlea(lifeTime); // to avoid too many deaths / births in firts generations
    });
  }

  move() {

    // let part, prev;
    let part, prev, dx, dy, s, c, r, rv, av, deltar;

    for (let k = 0; k < nbParticles; ++k) {
      part = particles[k];
      // death and re-birth
      if (part.TTL <= 0) {
        part = this.createParticle();
        particles[k] = part;
      }

      prev = { x: part.x, y: part.y }; // position before this this.move

      eddies.forEach((eddy) => {
        
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
    }
  }

  startOver() {

    // canvas dimensions

    maxx = window.innerWidth;
    maxy = window.innerHeight;

    dimx = maxx - 8; // for a small margin around the canvas
    dimy = maxy - 8; // for a small margin around the canvas

    canv.style.left = (maxx - dimx) / 20 + 'px';
    canv.style.top = (maxy - dimy) / 20 + 'px';

    canv.width = dimx;
    canv.height = dimy;

    ctx.lineWidth = 1.5;
    ctx.imageSmoothingEnabled = false;

    hueShift = this.intAlea(360);
    this.createEddies();
    this.createParticles();
    const that = this;
    if (typeof requestID == 'number') window.cancelAnimationFrame(requestID);
    (function animate() {
      that.move();
      requestID = window.requestAnimationFrame(animate);
    })();

  }
  
  clickCanvas() {
    this.startOver();
  }

  moveCanvas() {
    const canv = document.getElementsByTagName("canvas");
    for (let i = 0; i < canv.length; i++)
      canv[i].remove();
  }

  render() {
    return (
      <Link to="/index">
      <div className="splash-body">
        <div className="logo-container">
          <p className="tagline">Welcome to Plutus. It is an live auction site for luxurious items. Click on the logo to proceed.</p>
          <img onClick={this.moveCanvas} src="Logo4.png" alt="plutus-logo" className="plutus-logo"/>
        </div>
      </div>
    </Link>
    )
  }
}
export default withRouter(Splash);

