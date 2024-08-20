import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    mobile: { type: String, required: true },
    birthday: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String }
});

const User = model('User', userSchema);

export default User;
