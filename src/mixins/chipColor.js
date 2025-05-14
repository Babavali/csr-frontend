export function tierChipColor(tierLabel) {
	const tier = tierLabel?.toUpperCase()
	if (tier === 'HOT') {
		return '#FF0000'
	} else if (tier === 'WARM') {
		return '#FBAE3D'
	} else if (tier === 'COLD') {
		return '#2BAAE3'
	} else if (tier === 'CONVERTED') {
		return '#16A34A'
	}
	return '#000'
}
