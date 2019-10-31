export default {
    input: './src/index.js',
    external: ['@tensorflow/tfjs'],
    output: {
	file: './lib/index.umd.js',
	format: 'umd',
	name: 'cvstfjs',
	globals: {
	    '@tensorflow/tfjs': 'tf'
	}
    }
}
