import  express  from "express";
export const router = express.Router();


const ip = function(req, res) {
  let s = "Your IP Addresss is: " + req.socket.localAddress + '<br>';
  s += 'Remote IP Address is: ' + req.socket.remoteAddress;
  res.send(s);
}

router.get('/', ip);
