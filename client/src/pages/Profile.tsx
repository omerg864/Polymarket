import { useUpdateUserMutation, useUserQuery } from '@/api/user.api';
import BackButton from '@/components/custom/BackButton.tsx';
import FormInput from '@/components/form/FormInput';
import PageDisplay from '@/components/layout/PageDisplay';
import PageTitle from '@/components/layout/PageTitle.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from '@tanstack/react-form';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const profileSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
});

const Profile: FC = () => {
	const { t } = useTranslation('profile');
	const { data: user, isLoading: isLoadingUser } = useUserQuery();
	const updateMutation = useUpdateUserMutation();
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
		},
		validators: {
			onSubmit: profileSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await updateMutation.mutateAsync(value);
				toast.success(t('successMessages.update'));
			} catch {
				toast.error(t('errorMessages.update'));
			}
		},
	});

	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			<PageDisplay
				isLoading={isLoadingUser}
				fixed={
					<PageTitle
						className="mb-2"
						title={
							<div className="flex items-center gap-2">
								<BackButton onClick={() => navigate(-1)} />
								<h1 className="text-2xl font-bold">
									{t('title')}
								</h1>
							</div>
						}
					/>
				}
			>
				<div className="flex flex-col flex-1 overflow-y-auto px-4 pb-4 gap-4">
					<Card className="border-none shadow-md">
						<CardHeader>
							<CardTitle className="text-lg">
								{t('personalInfo')}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
								className="space-y-4"
							>
								<form.Field
									name="name"
									children={(field) => (
										<FormInput
											field={field}
											label={t('fields.name')}
										/>
									)}
								/>
								<form.Field
									name="email"
									children={(field) => (
										<FormInput
											field={field}
											label={t('fields.email')}
											type="email"
										/>
									)}
								/>
								<div className="flex gap-2">
									<Button
										type="submit"
										disabled={updateMutation.isPending}
									>
										{updateMutation.isPending
											? '...'
											: t('save')}
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => navigate(-1)}
									>
										{t('cancel')}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</PageDisplay>
		</div>
	);
};

export default Profile;
