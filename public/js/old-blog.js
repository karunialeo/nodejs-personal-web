let blogs = [];

function addBlog(event) {
  event.preventDefault();

  const title = document.getElementById("input-blog-title").value;

  let content = document.getElementById("input-blog-content").value;

  let image = document.getElementById("input-blog-image").files;
  let imageURL = URL.createObjectURL(image[0]);

  const author = 'Karunia Leo Gultom'

  const blog = {
    title,
    content,
    imageURL,
    author,
    postAt: new Date()
  };

  blogs.push(blog);

  renderBlog();

  console.log(blogs);
}

// DOM Manipulation

function renderBlog() {
  let contentContainer = document.getElementById("contents");

  contentContainer.innerHTML = blogDefaultContent()

  for (i = 0; i < blogs.length; i++) {
    contentContainer.innerHTML += `
      <div class="blog-list-item">
        <div class="blog-image">
          <img src="${blogs[i].imageURL}" alt="" />
        </div>
        <div class="blog-content">
          <div class="btn-group">
            <button class="btn-edit">Edit Post</button>
            <button class="btn-post">Post Blog</button>
          </div>
          <h1>
            <a href="/blog-detail/7" target="_blank"
              >${blogs[i].title}</a
            >
          </h1>
          <div class="detail-blog-content">
          ${getFullTime(blogs[i].postAt)} | ${blogs[i].author}
          </div>
          <p>
          ${blogs[i].content}
          </p>
          <div class="blog-time-history">
            <span>${getDistanceTime(blogs[i].postAt)}</span>
          </div>
        </div>
      </div>
    `;
  }
}

function blogDefaultContent() {
  return `
  <div class="blog-list-item">
    <div class="blog-image">
      <img src="../public/assets/img/blog-img.png" alt="" />
    </div>
    <div class="blog-content">
      <div class="btn-group">
        <button class="btn-edit">Edit Post</button>
        <button class="btn-post">Post Blog</button>
      </div>
      <h1>
        <a href="/blog-detail/7" target="_blank"
          >Pasar Coding di Indonesia Dinilai Masih Menjanjikan</a
        >
      </h1>
      <div class="detail-blog-content">
        6 Jan 2022 08:30 WIB | Karunia Leo
      </div>
      <p>
        Ketimpangan sumber daya manusia (SDM) di sektor digital masih
        menjadi isu yang belum terpecahkan. Berdasarkan penelitian
        ManpowerGroup, ketimpangan SDM global, termasuk Indonesia,
        meningkat dua kali lipat dalam satu dekade terakhir. Lorem ipsum,
        dolor sit amet consectetur adipisicing elit. Quam, molestiae
        numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta,
        eligendi debitis?
      </p>
      <div class="blog-time-history">
        <span>10 seconds ago</span>
      </div>
    </div>
  </div>
  `
}

function getFullTime(time) {
  const date = time.getDate()
  const year = time.getFullYear()
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const month = months[time.getMonth()]
  let hours = time.getHours()
  if(hours < 10) {
    hours = `0${hours}`
  }
  let minutes = time.getMinutes()
  if(minutes < 10) {
    minutes = `0${minutes}`
  }

  const fullTime = `${date} ${month} ${year} ${hours}:${minutes} WIB`

  return fullTime
}

function getDistanceTime(time) {
  let timePost = time

  let timeNow = new Date()

  let distance = timeNow - timePost

  let hours = 24
  let minutes = 60
  let seconds = 60
  let ms = 1000

  let distanceDay = distance / (ms * seconds * minutes * hours)
  let distanceHours = distance / (ms * seconds * minutes)
  let distanceMinutes = distance / (ms * seconds)
  let distanceSeconds = distance / ms

  distanceDay = Math.floor(distanceDay)
  distanceHours = Math.floor(distanceHours)
  distanceMinutes = Math.floor(distanceMinutes)
  distanceSeconds = Math.floor(distanceSeconds)

  if (distanceDay >= 1) {
    return distanceDay + ' day(s) ago';
  } else if (distanceHours >= 1) {
    return distanceHours + ' hour(s) ago';
  } else if (distanceMinutes >= 1) {
    return distanceMinutes + ' minute(s) ago';
  } else {
    return distanceSeconds + ' second(s) ago';
  }
}

setInterval(() => {
  renderBlog()
}, 10000)