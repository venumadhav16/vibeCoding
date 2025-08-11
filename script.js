// Farmers Market SPA - Best UI Version
const pages = ['index', 'register', 'login', 'dashboard', 'products', 'product_detail', 'social'];
const appState = {
  user: null,
  products: [
    {id: 1, name: 'Fresh Tomatoes', description: 'Organic, sun-ripened tomatoes.', price: 40, farmer: 'Ravi', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc'},
    {id: 2, name: 'Golden Wheat', description: 'Harvested this week, premium quality.', price: 28, farmer: 'Sunita', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b'},
  ],
  posts: [
    {id: 1, name: 'Ravi', content: 'Harvested fresh tomatoes today! Available at a great price.', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', created_at: '2025-08-06 12:00'},
    {id: 2, name: 'Sunita', content: 'Wheat just in! Place your orders.', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b', created_at: '2025-08-06 13:00'},
  ]
};

function navigate(page, param) {
  window.location.hash = page + (param ? ('/' + param) : '');
  renderPage();
}

function renderPage() {
  const hash = window.location.hash.replace('#', '') || 'index';
  let [page, param] = hash.split('/');
  if (!pages.includes(page)) page = 'index';
  document.body.innerHTML = templates[page](param);
  if (pageInit[page]) pageInit[page](param);
}

window.onhashchange = renderPage;
window.onload = renderPage;

function footer() {
  return `<footer>&copy; 2025 Farmers Market &mdash; The best place to share your crops and connect with happy customers!</footer>`;
}

const templates = {
  index: () => `
    <nav><a href="#index">Home</a> <a href="#products">Products</a> <a href="#social">Social Feed</a></nav>
    <div class="video-hero">
      <video autoplay muted loop playsinline poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb" id="heroVideo">
        <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="video-overlay">
        <h1>Welcome to Farmers Market</h1>
        <p style="font-size:1.25rem;max-width:500px;margin:auto;">
          The best website for connecting farmers and consumers!<br>
          Happily share your posts about crops, promote your harvest, and discover fresh produce direct from the source.<br>
          Join our thriving community and empower agriculture!
        </p>
      </div>
    </div>
    <div class="container" style="margin-top:0;">
      <div style="text-align:center;">
        <button onclick="navigate('register')">Register</button>
        <button onclick="navigate('login')">Login</button>
      </div>
    </div>
    ${footer()}
  `,
  register: () => `
    <nav><a href="#index">Home</a></nav>
    <div class="container">
      <h2>Register</h2>
      <form id="registerForm" autocomplete="off">
        <input type="text" name="name" placeholder="Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required minlength="6">
        <select name="type" required>
          <option value="farmer">Farmer</option>
          <option value="consumer">Consumer</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p id="registerMsg"></p>
      <p>Already have an account? <button class="link-btn" onclick="navigate('login')">Login here</button></p>
    </div>
    ${footer()}
  `,
  login: () => `
    <nav><a href="#index">Home</a></nav>
    <div class="container">
      <h2>Login</h2>
      <form id="loginForm" autocomplete="off">
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <p id="loginMsg"></p>
      <p>Don't have an account? <button class="link-btn" onclick="navigate('register')">Register here</button></p>
    </div>
    ${footer()}
  `,
  dashboard: () => {
    if (!appState.user) return templates.login();
    const avatarUrl = appState.user.type === 'farmer'
      ? 'https://cdn-icons-png.flaticon.com/512/616/616494.png'
      : 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png';
    return `
      <nav><a href="#index">Home</a> <a href="#products">Products</a> <a href="#social">Social Feed</a> <a href="#dashboard">Dashboard</a></nav>
      <div class="dashboard-card">
        <div class="dashboard-header">
          <img src="${avatarUrl}" alt="avatar" class="dashboard-avatar">
          <div>
            <h2 style="margin-bottom:4px">Welcome, ${appState.user.name}!</h2>
            <span class="dashboard-role">${appState.user.type === 'farmer' ? '🌾 Farmer' : '🛒 Consumer'}</span>
          </div>
        </div>
        <div class="dashboard-actions">
          ${appState.user.type === 'farmer' ? `
            <button class="dashboard-btn" onclick="navigate('products')">Manage My Products</button>
            <button class="dashboard-btn" onclick="navigate('social')">My Social Feed</button>
          ` : `
            <button class="dashboard-btn" onclick="navigate('products')">Browse Products</button>
            <button class="dashboard-btn" onclick="navigate('social')">Social Feed</button>
          `}
          <button class="dashboard-btn logout-btn" onclick="logout()">Logout</button>
        </div>
      </div>
      ${footer()}
    `;
  },
  products: () => {
    let html = `<nav><a href="#index">Home</a> <a href="#dashboard">Dashboard</a> <a href="#social">Social Feed</a></nav>`;
    if (appState.user && appState.user.type === 'farmer') {
      html += `
        <div class="add-product-card">
          <h3>Add a New Product</h3>
          <form id="addProductForm">
            <input type="text" name="name" placeholder="Crop Name" required>
            <textarea name="description" placeholder="Description" required></textarea>
            <input type="number" name="price" placeholder="Price" required min="1">
            <input type="url" name="image" placeholder="Image URL (optional)">
            <button type="submit" class="add-product-btn">Add Product</button>
          </form>
          <p id="addProductMsg"></p>
        </div>
      `;
    }
    html += `<div class="container product-list-section">
      <h2>Products</h2>
      <div id="productsList"></div>
    </div>
    ${footer()}`;
    return html;
  },
  social: () => {
    // Demo: alternate between image and stock video posts
    let html = `<nav><a href="#index">Home</a> <a href="#dashboard">Dashboard</a> <a href="#products">Products</a></nav><div class="container">
      <h2>Social Feed</h2>`;
    if (appState.user) {
      html += `<div class="add-post-card"><h3>Create a Post</h3>
        <form id="postForm">
          <textarea name="content" placeholder="What's new?" required></textarea>
          <input type="url" name="image" placeholder="Image/Video URL (optional)">
          <button type="submit">Post</button>
        </form>
        <p id="postMsg"></p></div>`;
    }
    html += `<div id="feed" class="social-feed"></div></div>
    ${footer()}`;
    return html;
  },
  product_detail: (id) => {
    const p = appState.products.find(x => x.id == id);
    if (!p) return `<div class="container"><p>Product not found.</p></div>${footer()}`;
    let html = `<nav><a href="#products">Back to Products</a></nav>
      <div class="container">
        <h2>${p.name}</h2>
        <div class="card">
          <p>${p.description}</p>
          <p>Price: ₹${p.price}</p>
          <p>Farmer: ${p.farmer}</p>
          ${p.image ? `<img class="product-img" src="${p.image}" alt="${p.name}">` : ''}
        </div>`;
    if (appState.user && appState.user.type === 'consumer') {
      html += `<h3>Order This Product</h3>
        <form id="orderForm">
          <input type="number" name="quantity" placeholder="Quantity" required min="1">
          <button type="submit">Place Order</button>
        </form>
        <p id="orderMsg"></p>`;
    }
    html += `</div>
    ${footer()}`;
    return html;
  },

};

const pageInit = {
  register: () => {
    document.getElementById('registerForm').onsubmit = function(e) {
      e.preventDefault();
      const f = e.target;
      const name = f.name.value.trim();
      const email = f.email.value.trim();
      const password = f.password.value;
      const type = f.type.value;
      if (!name || !email || !password || !type) {
        document.getElementById('registerMsg').textContent = 'All fields are required.';
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        document.getElementById('registerMsg').textContent = 'Enter a valid email.';
        return;
      }
      if (password.length < 6) {
        document.getElementById('registerMsg').textContent = 'Password must be at least 6 characters.';
        return;
      }
      // Simulate registration
      appState.user = {name, email, type};
      localStorage.setItem('user', JSON.stringify(appState.user));
      document.getElementById('registerMsg').textContent = 'Registration successful! Redirecting...';
      setTimeout(() => navigate('dashboard'), 800);
    };
  },
  login: () => {
    document.getElementById('loginForm').onsubmit = function(e) {
      e.preventDefault();
      const f = e.target;
      const email = f.email.value.trim();
      const password = f.password.value;
      if (!email || !password) {
        document.getElementById('loginMsg').textContent = 'All fields are required.';
        return;
      }
      // Simulate login (matches on email only for demo)
      if (appState.user && appState.user.email === email) {
        document.getElementById('loginMsg').textContent = 'Login successful! Redirecting...';
        setTimeout(() => navigate('dashboard'), 800);
      } else {
        document.getElementById('loginMsg').textContent = 'Invalid credentials (demo: register first).';
      }
    };
  },
  dashboard: () => {
    appState.user = JSON.parse(localStorage.getItem('user'));
    if (!appState.user) navigate('login');
  },
  products: () => {
    appState.user = JSON.parse(localStorage.getItem('user'));
    let html = '';
    for (const p of appState.products) {
      html += `<div class="product-card-beauty">
        ${p.image ? `<img class="product-img-beauty" src="${p.image}">` : ''}
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="product-meta">
            <span class="product-price">₹${p.price}</span>
            <span class="product-farmer">by ${p.farmer}</span>
          </div>
          <button class="view-detail-btn" onclick="navigate('product_detail',${p.id})">View Details</button>
        </div>
      </div>`;
    }
    document.getElementById('productsList').innerHTML = html || '<p>No products found.</p>';
    if (appState.user && appState.user.type === 'farmer') {
      document.getElementById('addProductForm').onsubmit = function(e) {
        e.preventDefault();
        const f = e.target;
        const name = f.name.value.trim();
        const description = f.description.value.trim();
        const price = parseFloat(f.price.value);
        const image = f.image.value.trim();
        if (!name || !description || !price) {
          document.getElementById('addProductMsg').textContent = 'All fields except image are required.';
          return;
        }
        appState.products.push({
          id: appState.products.length+1, name, description, price, farmer: appState.user.name, image
        });
        document.getElementById('addProductMsg').textContent = 'Product added!';
        f.reset();
        pageInit.products();
      };
    }
  },
  social: () => {
    appState.user = JSON.parse(localStorage.getItem('user'));
    // Demo: alternate between image and stock video posts
    const stockVideos = [
      'https://www.w3schools.com/html/mov_bbb.mp4',
      'https://www.w3schools.com/howto/rain.mp4',
      'https://media.istockphoto.com/id/1169545554/video/harvesting-corn.mp4'
    ];
    let html = '';
    appState.posts.forEach((post, i) => {
      html += `<div class="insta-post-card">
        <div class="insta-post-header">
          <span class="insta-avatar">${post.name[0]}</span>
          <b>${post.name}</b>
          <span class="insta-time">${post.created_at}</span>
        </div>
        <div class="insta-post-content">${post.content}</div>`;
      // Alternate between image and video
      if (i % 2 === 1) {
        const vid = stockVideos[i % stockVideos.length];
        html += `<video class="insta-post-media" controls poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb">
          <source src="${vid}" type="video/mp4">Your browser does not support the video tag.
        </video>`;
      } else if (post.image) {
        html += `<img class="insta-post-media" src="${post.image}">`;
      }
      html += `</div>`;
    });
    document.getElementById('feed').innerHTML = html || '<p>No posts yet.</p>';
    if (appState.user) {
      document.getElementById('postForm').onsubmit = function(e) {
        e.preventDefault();
        const f = e.target;
        const content = f.content.value.trim();
        const image = f.image.value.trim();
        if (!content) {
          document.getElementById('postMsg').textContent = 'Post content required.';
          return;
        }
        appState.posts.unshift({
          id: appState.posts.length+1, name: appState.user.name, content, image, created_at: new Date().toISOString().slice(0,16).replace('T',' ')
        });
        document.getElementById('postMsg').textContent = 'Posted!';
        f.reset();
        pageInit.social();
      };
    }
  },
  product_detail: (id) => {
    appState.user = JSON.parse(localStorage.getItem('user'));
    const p = appState.products.find(x => x.id == id);
    if (!p) return;
    if (appState.user && appState.user.type === 'consumer') {
      document.getElementById('orderForm').onsubmit = function(e) {
        e.preventDefault();
        const f = e.target;
        const qty = parseInt(f.quantity.value);
        if (!qty || qty < 1) {
          document.getElementById('orderMsg').textContent = 'Enter a valid quantity.';
          return;
        }
        document.getElementById('orderMsg').textContent = 'Order placed! (demo only)';
        f.reset();
      };
    }
  },
  social: () => {
    appState.user = JSON.parse(localStorage.getItem('user'));
    let html = '';
    for (const post of appState.posts) {
      html += `<div class="card">
        <b>${post.name}</b> <span style="color:#888;font-size:12px">${post.created_at}</span>
        <p>${post.content}</p>
        ${post.image ? `<img class="post-img" src="${post.image}">` : ''}
      </div>`;
    }
    document.getElementById('feed').innerHTML = html || '<p>No posts yet.</p>';
    if (appState.user) {
      document.getElementById('postForm').onsubmit = function(e) {
        e.preventDefault();
        const f = e.target;
        const content = f.content.value.trim();
        const image = f.image.value.trim();
        if (!content) {
          document.getElementById('postMsg').textContent = 'Post content required.';
          return;
        }
        appState.posts.unshift({
          id: appState.posts.length+1, name: appState.user.name, content, image, created_at: new Date().toISOString().slice(0,16).replace('T',' ')
        });
        document.getElementById('postMsg').textContent = 'Posted!';
        f.reset();
        pageInit.social();
      };
    }
  }
};

function logout() {
  localStorage.removeItem('user');
  appState.user = null;
  navigate('login');
}
