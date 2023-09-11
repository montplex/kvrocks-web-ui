<template>
	<span class="gi-more-icon-wrap">
		<span class="gi-more-icon">
			<i class="block-top block"></i>
			<i class="block-bottom block"></i>
		</span>
	</span>
</template>

<script lang="ts">
export default {
	name: 'GiMoreIcon',
}
</script>

<style lang="scss" scoped>
.gi-more-icon-wrap {
	position: relative;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;

	&::before {
		content: '';
		width: 26px;
		height: 26px;
		position: absolute;
		left: -6px;
		top: -6px;
		cursor: pointer;
	}

	.gi-more-icon {
		display: inline-block;
		color: #5c5c5c;
		cursor: pointer;
		transition: transform 0.3s ease-out;

		.block {
			position: relative;
			display: block;
			width: 14px;
			height: 6px;

			// &.block-top:before {
			//   transition: transform 0.3s ease-out 0.3s;
			// }
			&.block-bottom {
				margin-top: 2px;
			}
		}

		.block:before {
			position: absolute;
			left: 0;
			width: 6px;
			height: 6px;
			content: '';
			background: #909399;
		}

		.block:after {
			position: absolute;
			left: 8px;
			width: 6px;
			height: 6px;
			content: '';
			background: #909399;
		}
	}
}

.gi-more-icon-wrap:hover .gi-more-icon .block:first-child::before,
.arco-dropdown-open .gi-more-icon .block:first-child::before {
	transform: rotate(45deg);
	background: #83bafd;
}

.gi-more-icon-wrap:hover .gi-more-icon .block:before,
.arco-dropdown-open .gi-more-icon .block:before {
	background: #005dfb;
}

.gi-more-icon-wrap:hover .gi-more-icon .block:after,
.arco-dropdown-open .gi-more-icon .block:after {
	background: #005dfb;
}

.gi-more-icon-wrap:hover .gi-more-icon,
.arco-dropdown-open .gi-more-icon {
	transform: rotate(90deg);
}
</style>
