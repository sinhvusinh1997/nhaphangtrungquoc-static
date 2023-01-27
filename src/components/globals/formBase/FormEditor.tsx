import React from "react";
import {Editor} from "@tinymce/tinymce-react";
import {Control, Controller, FieldValues, Path, RegisterOptions} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";

const init = {
	height: 600,
	menubar: true,
	plugins: [
		"advlist autolink lists link image charmap print preview anchor",
		"searchreplace visualblocks code fullscreen",
		"insertdatetime media table paste code help wordcount",
	],
	toolbar:
		"formatselect | " +
		"bold italic forecolor backcolor | alignleft aligncenter " +
		"alignright alignjustify | bullist numlist outdent indent | " +
		"removeformat | help",
	content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
	setup: function (ed) {
		ed.on("keydown", function (event) {
			if (event.keyCode == 9) {
				event.preventDefault();
				if (event.shiftKey) {
					ed.execCommand("Outdent");
				} else {
					ed.execCommand("Indent");
				}
				return false;
			}
		});
	},
};

type TProps<TFieldValues> = {
	required?: boolean;
	name: Path<TFieldValues>;
	label: string;
	rules?: RegisterOptions;
	control: Control<TFieldValues, object>;
};

export const FormEditor = <TFieldValues extends FieldValues = FieldValues>({
	control,
	label,
	name,
	required = true,
	rules,
}: TProps<TFieldValues>) => {
	return (
		<React.Fragment>
			<label className="text-[12px] py-[2px] uppercase font-bold" htmlFor={name}>
				{label} {required === true && <span className="text-red">*</span>}
			</label>
			<Controller
				control={control}
				name={name}
				rules={rules}
				render={({field: {onChange, ...newField}, formState: {errors}}) => (
					<div>
						<Editor
							id={name}
							apiKey={"iac8cfkdevssbiceknww2kkrpmblwb0ywmzork74l3kg1tlc"}
							init={{
								...init,
								// content_style: "div { border: 5px solid red }",
								language: "vi",
								language_url: "/langs/vi.js",
							}}
							onEditorChange={onChange}
							{...newField}
						/>
						<ErrorMessage
							errors={errors}
							name={name as any}
							render={({message}) => <p className="text-warning text-xs font-medium mt-1">{message}</p>}
						/>
					</div>
				)}
			/>
		</React.Fragment>
	);
};
