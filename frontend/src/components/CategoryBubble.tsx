import { HiOutlineSquares2X2 } from "react-icons/hi2";
import React from "react";

const categories = [
	{ id: "all", name: "All" },
	{ id: "food", name: "Food" },
	{ id: "grocery", name: "Grocery" },
	{ id: "pharmacy", name: "Pharmacy" },
	{ id: "electronics", name: "Electronics" },
	// Add more as needed
];

const CategoryBubble: React.FC<{ onSelect: (cat: string) => void; selected: string }> = ({ onSelect, selected }) => {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
				<button
					className={`w-16 h-16 rounded-full bg-yellow-400 shadow-lg flex items-center justify-center text-2xl font-bold text-white hover:bg-yellow-500 focus:outline-none morphing-bubble${
						open ? " morphing-bubble-active" : ""
					}`}
					onClick={() => setOpen((v) => !v)}
					aria-label="Select category"
					title="Select category"
				>
					<HiOutlineSquares2X2 size={36} color="#111" />
				</button>
				<div
					className={`transition-all duration-500 ease-in-out ${
						open ? "scale-100 opacity-100 morphing-panel slide-up-panel" : "scale-75 opacity-0 pointer-events-none"
					} origin-bottom-right`}
				>
					{open && (
						<div className="mt-2 bg-white rounded-lg shadow-lg p-3 flex flex-col gap-2 animate-fade-in-down">
							{categories.map((cat) => (
								<button
									key={cat.id}
									className={`px-4 py-2 rounded text-sm font-semibold transition ${
										selected === cat.id
											? "bg-yellow-400 text-white"
											: "bg-gray-100 hover:bg-yellow-100"
									}`}
									onClick={() => {
										onSelect(cat.id);
										setOpen(false);
									}}
								>
									{cat.name}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
			<style jsx global>{`
				.morphing-bubble {
					animation: morph-bubble 3s infinite alternate ease-in-out;
				}
				.morphing-bubble-active {
					animation: morph-bubble-active 0.5s cubic-bezier(0.4, 1.4, 0.6, 1) 1;
				}
				@keyframes morph-bubble {
					0% {
						border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
						transform: scale(1) rotate(0deg);
					}
					25% {
						border-radius: 60% 40% 55% 45% / 45% 55% 60% 40%;
						transform: scale(1.05) rotate(-2deg);
					}
					50% {
						border-radius: 50% 60% 40% 60% / 60% 40% 60% 40%;
						transform: scale(0.97) rotate(2deg);
					}
					75% {
						border-radius: 55% 45% 60% 40% / 40% 60% 45% 55%;
						transform: scale(1.03) rotate(-1deg);
					}
					100% {
						border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
						transform: scale(1) rotate(0deg);
					}
				}
				@keyframes morph-bubble-active {
					0% {
						border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
						transform: scale(1);
					}
					100% {
						border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
						transform: scale(1.15);
					}
				}
				.morphing-panel {
					animation: morph-panel-in 0.5s cubic-bezier(0.4, 1.4, 0.6, 1);
				}
				@keyframes morph-panel-in {
					0% {
						border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
						transform: scale(0.75);
						opacity: 0;
					}
					100% {
						border-radius: 18px;
						transform: scale(1);
						opacity: 1;
					}
				}
				.slide-up-panel {
					animation: slide-up-panel-in 0.5s cubic-bezier(0.4, 1.4, 0.6, 1);
				}
				@keyframes slide-up-panel-in {
					0% {
						transform: translateY(40px) scale(0.75);
						opacity: 0;
					}
					100% {
						transform: translateY(0) scale(1);
						opacity: 1;
					}
				}
			`}</style>
		</>
	);
};

export default CategoryBubble;
