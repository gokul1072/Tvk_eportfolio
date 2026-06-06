# TVK Party ePortfolio Repository 🚩

A secure, high-performance web-based ePortfolio application built for managing and exploring the organizational structure of the Tamilaga Vettri Kazhagam (TVK) Party. Backed entirely by Google Sheets via Google Apps Script (GAS).

## 🚀 Key Enterprise Features
- **Admin Security Shield:** Integrated top-right security token vault for executive access.
- **Dynamic Access Control:** Normal members' contact information is dynamically masked until verified via an administrative session.
- **Women's Wing Isolated Gateway:** Independent password verification rules applied to custom data sheets.
- **Unified Search Indexer:** Real-time Client-side data query evaluation engine across Name, Position, and Area fields.

## 📊 Google Sheets (Backend Structure)

### `Config` Sheet Layout Blueprint
To handle production authentication smoothly, format your `Config` tab with these exact keys:

| Column A (Key) | Column B (Value) | Description |
| :--- | :--- | :--- |
| `AppLogo` | `https://drive.google.com/...` | System wide branding logo asset |
| `WomenWingPassword` | `TVK` | Secure access code for the Women's Wing tab |
| `AdminUsername` | `admin` | Production administrator login ID |
| `AdminPassword` | `TVK@admin2026` | Enterprise administrative credential passphrase |

---

## 🛠️ Deployment Instructions
1. Open your target Google Sheet.
2. Click on **Extensions** > **Apps Script**.
3. Replicate the directory tree structure by creating `Index.html`, `Styles.html`, and `Scripts.html`.
4. Paste the respective production files into your Apps Script editor.
5. Click **Deploy** > **New Deployment** > Select **Web App**.
6. Set access permission to **"Anyone"** and run your initialization sweep.