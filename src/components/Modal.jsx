/* eslint-disable react/prop-types */

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ShareModal = ({ show, handleClose, score, shareUrl }) => {
  const handleShare = (platform) => {
    let shareLink = "";
    const text = `I scored ${score} in NBA Chain Game!`;

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${text} ${shareUrl}`;
        break;
      case "reddit":
        shareLink = `https://www.reddit.com/submit?url=${shareUrl}&title=${text}`;
        break;
      case "discord":
        shareLink = `https://discordapp.com/channels/@me?message=${text} ${shareUrl}`;
        break;
      case "email":
        shareLink = `mailto:?subject=I scored ${score} in NBA Chain Game&body=${text} ${shareUrl}`;
        break;
      default:
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank");
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "custom-modal",
      }}
    >
      <DialogTitle className="share-modal-title">Share Your Score</DialogTitle>
      <DialogContent>
        <button
          className="share-button x"
          onClick={() => handleShare("twitter")}
        >
          X
        </button>
        <button
          className="share-button facebook"
          onClick={() => handleShare("facebook")}
        >
          Facebook
        </button>
        <button
          className="share-button whatsapp"
          onClick={() => handleShare("whatsapp")}
        >
          WhatsApp
        </button>
        <button
          className="share-button reddit"
          onClick={() => handleShare("reddit")}
        >
          Reddit
        </button>
        <button
          className="share-button discord"
          onClick={() => handleShare("discord")}
        >
          Discord
        </button>
        <button
          className="share-button email"
          onClick={() => handleShare("email")}
        >
          Email
        </button>
        <button
          className="share-button copy"
          onClick={() => navigator.clipboard.writeText(shareUrl)}
        >
          Copy Link
        </button>
      </DialogContent>
      <DialogActions>
        <button className="close-button" onClick={handleClose}>
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareModal;
