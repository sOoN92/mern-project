import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const UserModel = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    { collection: 'users' }
);

UserModel.pre('save', async function save(next) {
    const user: any = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        user.password = await bcrypt.hash(user.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

UserModel.methods.comparePassword = function (candidatePassword: string, cb: any) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => cb( err, isMatch));
}

const model = mongoose.model('UserModel', UserModel);

export default model;