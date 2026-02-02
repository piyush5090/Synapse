import express from 'express';
import { trackClick } from '../services/linkService.js';

const router = express.Router();

// GET /r/:code
// Example: http://localhost:3001/api/r/AbC12345
router.get('/:code', async (req, res) => {
    console.log("Headers:", req.headers);
  const { code } = req.params;
  
  // Browser info capture karo
  const userAgent = req.headers['user-agent'];
  const referrer = req.headers['referer'] || req.headers['referrer'];
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const targetUrl = await trackClick(code, userAgent, referrer, ip);

    if (targetUrl) {
      // 301 Permanent Redirect -> SEO ke liye better hai, par analytics ke liye 302 Temporary better hai
      // taaki browser cache na kare aur har click server tak aaye.
      return res.redirect(302, targetUrl); 
    } else {
      return res.status(404).send(`
        <h1>Link Not Found</h1>
        <p>The link you are trying to access does not exist or has expired.</p>
      `);
    }
  } catch (err) {
    console.error("Redirect Fatal Error:", err);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;