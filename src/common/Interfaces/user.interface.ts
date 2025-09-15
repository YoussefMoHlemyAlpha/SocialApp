export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    emailOtp: {
        Otp: string;
        expireAt: Date
    };
    phone:string

}

