import Link from "next/link";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {ContactUs} from "~/api/contact-us";
import {FormInput, FormTextarea} from "~/components/globals/formBase";
import styles from "./index.module.css";

export const HomeInfoContact = ({data}) => {
	const [showForm, setShowForm] = useState(true);

	const {handleSubmit, control, reset} = useForm({
		mode: "onBlur",
		defaultValues: {
			FullName: "",
			Phone: "",
			Email: "",
			Content: "",
		},
	});

	const _onSubmit = (data) => {
		const id = toast.loading("Đang gửi thông tin ...");
		ContactUs.create(data)
			.then(() => {
				toast.update(id, {
					render: "Gửi thành công! Cảm ơn bạn đã quan tâm đến chúng tôi!",
					type: "success",
					isLoading: false,
					autoClose: 1000,
				});
				reset();
			})
			.catch(() => {
				toast.update(id, {
					render: "Gửi thất bại!",
					type: "error",
					isLoading: false,
					autoClose: 1000,
				});
			});
	};

	return (
		<div className={styles.InfoContact}>
			<h1 className="mainTitle text-center">Liên hệ với chúng tôi</h1>
			<div className="mt-[75px] grid grid-cols-2">
				<div className={styles.map}>
					<iframe
						src={data?.GoogleMapLink ?? ""}
						width="100%"
						height="560"
						title="Mona media"
						allowFullScreen={true}
						loading="lazy"
					></iframe>
				</div>
				<div className={styles.showForm} onClick={() => setShowForm(!showForm)}>
					<i className={`fas fa-arrow-circle-down transition-all ${showForm && "rotate-180"}`}></i>
				</div>
				<div className={`${styles.form} transition-all ${showForm ? "" : "!top-[40%] opacity-0 pointer-events-none"}`}>
					<form onSubmit={handleSubmit(_onSubmit)}>
						<div className={styles.innerForm}>
							<div className="col-span-1">
								<FormInput control={control} name="FullName" placeholder="Họ và tên" inputClassName={styles.formBox} />
							</div>
							<div className="col-span-1">
								<FormInput control={control} name="Phone" placeholder="Phone" inputClassName={styles.formBox} />
							</div>
							<div className="col-span-2">
								<FormInput control={control} name="Email" placeholder="Email" inputClassName={`${styles.formBox}`} />
							</div>
							<div className="col-span-2">
								<FormTextarea
									control={control}
									name="Content"
									placeholder="Nội dung"
									inputClassName={`${styles.formBox} !resize-none !h-[200px]`}
								/>
							</div>
						</div>
						<button className={styles.button} type="submit">
							<a>Gửi</a>
						</button>
					</form>
					<div className={styles.contactDetail}>
						<a href={`tel:${data?.Hotline}`}>
							<img src="./phone.png" alt="" />
							{data?.Hotline}
						</a>
						<a href={`mailto:${data?.EmailContact}`}>
							<img src="./envelope.png" alt="" />
							{data?.EmailContact}
						</a>
						<a>
							<img src="./clock.png" alt="" />
							{data?.TimeWork}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
