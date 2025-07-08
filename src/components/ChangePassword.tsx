"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { POST_API } from "@/lib/fetchAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Shield, ShieldHalf } from "lucide-react";
import { Label } from "@/components/ui/label";
import Loading from "@/components/ui/loading";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
export default function ChangePassword({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    const router = useRouter();
    const token = Cookies.get("token") || "";
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Function to check if all password requirements are met
    const checkPasswordRequirements = (password: string) => {
        return {
            minLength: password.length >= 6,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[^A-Za-z0-9]/.test(password),
        };
    };

    const isPasswordValid = (password: string) => {
        const requirements = checkPasswordRequirements(password);
        return Object.values(requirements).every(Boolean);
    };

    const formik = useFormik({
        initialValues: {
            password: "",
            rePassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
                .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
                .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
                .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số")
                .matches(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt")
                .required("Vui lòng nhập password"),

            rePassword: Yup.string()
                .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
                .required("Vui lòng nhập lại mật khẩu"),
        }),
        onSubmit: (values) => {
            const profile = {
                new_password: values.password,
                re_new_password: values.rePassword,
            };
            fetchForgotPassword(profile);
        },
    });

    const fetchForgotPassword = async (profile: any) => {
        try {
            setLoading(true);
            const res = await POST_API("/auth/change-password", profile, "POST", token);
            const data = await res?.json();
            if (data?.ok) {
                toast.success(data.message, {
                    position: "top-center",
                });
                setIsOpen(false);
                router.push("/");
            } else {
                toast.error("Thay đổi mật khẩu thất bại", {
                    description: data?.message || "Đã xảy ra lỗi không xác định",
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("Lỗi", {
                description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
                position: "top-center",
            });
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <form className=" space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Tạo mật khẩu mới</h1>
                        <p className="text-gray-600 w-full md:w-[400px] mx-auto dark:text-gray-400">Mật khẩu mới phải khác với mật khẩu cũ và đảm bảo tính bảo mật.</p>
                    </div>

                    {/* Email/Password Form */}
                    <div className="space-y-4">
                        <div className="space-y-2 relative">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mật khẩu
                            </Label>{" "}
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu của bạn"
                                className="h-11"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 translate-y-[50%] h-11 w-10" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="rePassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nhập lại mật khẩu
                            </Label>{" "}
                            <Input
                                id="rePassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu của bạn"
                                className="h-11"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.rePassword}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-11 w-10 translate-y-[50%]"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>{" "}
                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700/80">
                            <h4 className="text-sm font-medium text-gray-900 mb-2 dark:text-white/80">Yêu cầu mật khẩu:</h4>
                            <ul className="text-xs text-gray-600 space-y-1 dark:text-gray-400">
                                <li className={checkPasswordRequirements(formik.values.password).minLength ? "text-green-600 dark:text-green-400" : ""}>
                                    • Tối thiểu 6 ký tự
                                    {checkPasswordRequirements(formik.values.password).minLength && <span className="ml-1">✓</span>}
                                </li>
                                <li className={checkPasswordRequirements(formik.values.password).hasUppercase ? "text-green-600 dark:text-green-400" : ""}>
                                    • Ít nhất 1 chữ hoa
                                    {checkPasswordRequirements(formik.values.password).hasUppercase && <span className="ml-1">✓</span>}
                                </li>
                                <li className={checkPasswordRequirements(formik.values.password).hasLowercase ? "text-green-600 dark:text-green-400" : ""}>
                                    • Ít nhất 1 chữ thường
                                    {checkPasswordRequirements(formik.values.password).hasLowercase && <span className="ml-1">✓</span>}
                                </li>
                                <li className={checkPasswordRequirements(formik.values.password).hasNumber ? "text-green-600 dark:text-green-400" : ""}>
                                    • Ít nhất 1 số
                                    {checkPasswordRequirements(formik.values.password).hasNumber && <span className="ml-1">✓</span>}
                                </li>
                                <li className={checkPasswordRequirements(formik.values.password).hasSpecialChar ? "text-green-600 dark:text-green-400" : ""}>
                                    • Ít nhất 1 ký tự đặc biệt
                                    {checkPasswordRequirements(formik.values.password).hasSpecialChar && <span className="ml-1">✓</span>}
                                </li>{" "}
                            </ul>
                        </div>
                        {/* Status messages */}
                        {formik.values.password && !isPasswordValid(formik.values.password) && (
                            <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                                ⚠️ Vui lòng đáp ứng tất cả yêu cầu mật khẩu ở trên để tiếp tục
                            </div>
                        )}
                        {formik.values.password && formik.values.rePassword && formik.values.password !== formik.values.rePassword && (
                            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">❌ Mật khẩu nhập lại không khớp</div>
                        )}
                        {/* {isPasswordValid(formik.values.password) && formik.values.password === formik.values.rePassword && formik.values.rePassword && (
                            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">✓ Mật khẩu hợp lệ, sẵn sàng cập nhật</div>
                        )} */}
                        <Button
                            className="relative group overflow-hidden w-full h-11 bg-primary text-white hover:scale-105 transition-all duration-200"
                            disabled={loading || !isPasswordValid(formik.values.password) || !formik.values.rePassword || formik.values.password !== formik.values.rePassword}
                            type="submit">
                            {loading ? <Loading /> : <ShieldHalf />}
                            Cập nhật mật khẩu
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80  dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
