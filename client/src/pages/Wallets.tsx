import {
	useCreateWalletMutation,
	useDeleteWalletMutation,
	useWalletsQuery,
} from '@/api/wallet.api';
import FormInput from '@/components/form/FormInput';
import PageTitle from '@/components/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { useForm } from '@tanstack/react-form';
import { Plus, Trash2, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const walletSchema = z.object({
	address: z.string().min(1),
	label: z.string(),
});

export default function Wallets() {
	const { t } = useTranslation('wallets');
	const { t: tGeneric } = useTranslation('generic');
	const { data: wallets = [], isLoading } = useWalletsQuery();
	const createMutation = useCreateWalletMutation();
	const deleteMutation = useDeleteWalletMutation();
	const [isFormOpen, setIsFormOpen] = useState(false);

	const form = useForm({
		defaultValues: {
			address: '',
			label: '',
		},
		validators: {
			onSubmit: walletSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await createMutation.mutateAsync({
					address: value.address.trim(),
					label: value.label?.trim() || undefined,
				});
				toast.success(t('walletCreated'));
				form.reset();
				setIsFormOpen(false);
			} catch {
				toast.error('Failed to add wallet');
			}
		},
	});

	const handleDelete = async (id: string) => {
		try {
			await deleteMutation.mutateAsync(id);
			toast.success(t('walletDeleted'));
		} catch {
			toast.error('Failed to delete wallet');
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<PageTitle title={t('title')} />
				<Button onClick={() => setIsFormOpen(true)} className="gap-2">
					<Plus className="h-4 w-4" />
					{t('addWallet')}
				</Button>
			</div>

			{!isLoading && wallets.length === 0 ? (
				<Card className="border-none shadow-md">
					<CardContent className="flex flex-col items-center justify-center py-16 text-center">
						<Wallet className="mb-4 h-16 w-16 text-slate-300" />
						<h3 className="text-lg font-semibold text-slate-700">
							{t('noWalletsFound')}
						</h3>
						<p className="mt-1 text-sm text-slate-500">
							{t('addYourFirst')}
						</p>
						<Button
							onClick={() => setIsFormOpen(true)}
							className="mt-6 gap-2"
						>
							<Plus className="h-4 w-4" />
							{t('addWallet')}
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{wallets.map((wallet) => (
						<Card key={wallet.id} className="border-none shadow-md">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-semibold truncate max-w-[200px]">
									{wallet.label || wallet.address}
								</CardTitle>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-slate-400 hover:text-red-500"
									onClick={() => handleDelete(wallet.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</CardHeader>
							<CardContent>
								<p className="mb-3 truncate font-mono text-xs text-slate-400">
									{wallet.address}
								</p>
								<Link
									to={`/positions?walletId=${wallet.id}`}
									className="text-sm font-medium text-blue-600 hover:text-blue-800"
								>
									{t('viewPositions')} →
								</Link>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>{t('addWallet')}</SheetTitle>
					</SheetHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="mt-6 space-y-4"
					>
						<form.Field
							name="address"
							children={(field) => (
								<FormInput
									field={field}
									label={t('walletAddress')}
									placeholder={t('addressPlaceholder')}
									required
								/>
							)}
						/>
						<form.Field
							name="label"
							children={(field) => (
								<FormInput
									field={field}
									label={t('label')}
									placeholder={t('labelPlaceholder')}
								/>
							)}
						/>
						<div className="flex gap-2 pt-4">
							<Button
								type="submit"
								className="flex-1"
								disabled={createMutation.isPending}
							>
								{createMutation.isPending
									? '...'
									: tGeneric('add')}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsFormOpen(false)}
							>
								{tGeneric('cancel')}
							</Button>
						</div>
					</form>
				</SheetContent>
			</Sheet>
		</div>
	);
}
