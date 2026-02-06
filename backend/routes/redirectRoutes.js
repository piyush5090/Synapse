import express from 'express';
import { trackClick } from '../services/linkService.js';

const router = express.Router();

router.get('/:code', async (req, res) => {
  const { code } = req.params;
  const userAgent = req.headers['user-agent'] || ''; // Get the User-Agent

  try {
    // Pass userAgent to the service
    const targetUrl = await trackClick(code, userAgent);

    if (targetUrl) {
      return res.redirect(302, targetUrl); 
    } else {
      return res.status(404).send('Link not found');
    }
  } catch (err) {
    console.error("Redirect Fatal Error:", err);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;