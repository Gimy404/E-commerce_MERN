import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const register = async ({
    firstName,
    lastName,
    email,
    password,
}: RegisterParams) => {
    
    // البحث عن مستخدم بنفس البريد الإلكتروني
    const findUser = await userModel.findOne({ email });

    // إذا كان المستخدم موجودًا، نُعيد رسالة خطأ
    if (findUser) {
        return { data: "User already exists!", statusCode: 400 };
    }

    // تشفير كلمة المرور باستخدام bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد بالمعلومات المدخلة
    const newUser = new userModel({ email, password: hashedPassword, firstName, lastName });

    // حفظ المستخدم الجديد في قاعدة البيانات
    await newUser.save();

    // إرجاع بيانات المستخدم المسجلة
    return { data: generateJWT({firstName,lastName,email}), statusCode: 200 };
};


interface LoginParams {
    email: string;
    password: string;
}

export const login = async ({ email, password }: LoginParams) => {
    // البحث عن المستخدم في قاعدة البيانات عن طريق البريد الإلكتروني
    const findUser = await userModel.findOne({ email });

    // إذا لم يتم العثور على المستخدم، نرجع رسالة خطأ
    if (!findUser) {
        return { data: "Incorrect email or password!", statusCode: 400 };
    }

    // مقارنة كلمة المرور المُدخلة مع الكلمة المشفرة المخزنة
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (passwordMatch) {
        return { data: generateJWT({ email, firstName: findUser.firstName, lastName: findUser.lastName }), statusCode: 200 };
    }
    

    // إذا كانت كلمة المرور خاطئة، نرجع رسالة خطأ
    return { data: "Incorrect email or password!", statusCode: 400 };
};


const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || '');
};


