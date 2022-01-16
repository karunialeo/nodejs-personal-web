const card = document.getElementById('profileCard')
const desc = document.getElementById('profileDesc')
const js = document.getElementById('profileJS')
const git = document.getElementById('profileGit')
const deploy = document.getElementById('profileDeploy')
const socials = document.getElementById('profileSocials')

const tl = new TimelineMax()

tl.fromTo(card, 1.5, {x: '-15%', opacity: 0}, {x: '0%', opacity: 1, ease: Power2.easeOut})
    .fromTo(desc, 2, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut}, '-=2')
    .fromTo(js, 2, {y: '10%', opacity: 0}, {y: '0%', opacity: 1, ease: Power2.easeInOut}, '-=2')
    .fromTo(git, 2, {y: '10%', opacity: 0}, {y: '0%', opacity: 1, ease: Power2.easeInOut}, '-=2')
    .fromTo(deploy, 2, {y: '10%', opacity: 0}, {y: '0%', opacity: 1, ease: Power2.easeInOut}, '-=2')
    .fromTo(socials, 2, {y: '10%', opacity: 0}, {y: '0%', opacity: 1, ease: Power2.easeInOut}, '-=2')