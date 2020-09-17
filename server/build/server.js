"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = express_1.default();
const JWT_SECRET_TOKEN = 'fsdjfnjògjdfgjdfò^^????1gkjòkldfgjò$%&1231233___!!!dfkjgkldfjgklògjdklfg';
mongoose_1.default.connect('mongodb://localhost:27017/codedamn-live');
if (process.env.NODE_ENV !== 'production') {
    app.use(cors_1.default());
}
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('ok');
});
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ status: 'error', error: 'Invalid email/password' });
    }
    try {
        const user = new user_1.default({ email, password });
        await user.save();
    }
    catch (error) {
        console.log(error);
        return res.json({ status: 'error', error: 'Duplicate email' });
    }
    return res.json({ status: 'ok' });
});
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ status: 'error', error: 'Invalid email/password' });
    }
    return user_1.default.findOne({ email }, (err, _user) => {
        if (err)
            throw err;
        if (_user) {
            _user.comparePassword(password, (_err, _match) => {
                console.log('IS MATCHED:', _match);
                if (_match && !_err) {
                    const payload = jsonwebtoken_1.default.sign({ email }, JWT_SECRET_TOKEN);
                    return res.json({ status: 'ok', data: payload });
                }
                else {
                    return res.json({ status: 'error', error: 'Password not matched' });
                }
            });
        }
        else {
            return res.json({ status: 'error', error: 'User not found' });
        }
    });
});
app.listen(1337);
