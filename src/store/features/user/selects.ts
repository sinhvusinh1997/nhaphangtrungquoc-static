import { EPermission, TControllerList } from '~/configs';
import { RootState } from '~/store';

export const selectUser = (state: RootState) => ({
	user: state.user.current
});
export const selectRouter = (state: RootState) => state.user.menuRouter;
export const selectFirstPageDashboard = (state: RootState) => {
	try {
		const routers = state.user.menuRouter;
		if (!routers && !routers?.length) return '';
		let path = '';
		const firstGroup = routers[0].controllers[0];
		path = firstGroup.path;
		if (path && path !== 'javascript:;') return path;
		const firstChildInGroup = firstGroup?.childrens[0];
		if (!firstChildInGroup) return '';
		path = firstChildInGroup.path;
		return path;
	} catch (err) {
		return '';
	}
};

export const selectApiRoles = (state: RootState) => state.user.apiRoles;

export const selectIsAcceptRoles =
	({
		controller,
		permissionsRequired,
		mode = 'every'
	}: {
		controller: TControllerList;
		permissionsRequired: EPermission[];
		mode?: 'every' | 'some';
	}) =>
	(state: RootState) => {
		const apiRolesOfUser = state.user.apiRoles;
		if (!apiRolesOfUser) return false;
		const _permissions = apiRolesOfUser[controller];
		if (!_permissions) return false;
		if (mode === 'every') {
			const _every = permissionsRequired.every((item) =>
				_permissions.includes(item)
			);
			return _every;
		}
		if (mode === 'some') {
			const _some = permissionsRequired.some((item) =>
				_permissions.includes(item)
			);
			return _some;
		}
	};
export const selectConnection = (state: RootState) => state.user.connection;
