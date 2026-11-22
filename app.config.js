// APP_VARIANT=development 로 빌드하면 기존 앱과 데이터가 분리된 별도 앱으로 설치된다
const IS_DEV = process.env.APP_VARIANT === 'development';

export default ({ config }) => ({
	...config,
	name: IS_DEV ? 'indexly dev' : config.name,
	ios: {
		...config.ios,
		bundleIdentifier: IS_DEV ? 'com.janechun.indexly.dev' : config.ios.bundleIdentifier,
	},
});
