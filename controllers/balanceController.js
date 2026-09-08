import User from "../models/User.js";

export async function claimReward(req, res) {
    try {
        const userId = req.user.userId;
        const now = new Date();
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        if (user.nextRewardTime && now < user.nextRewardTime) {
            const timeLeft = user.nextRewardTime.getTime() - now.getTime();
            
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutesLeft = Math.ceil((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

            return res.status(400).json({ 
                message: "You have to wait 24 hours between each award",
                timeLeft: { hours: hoursLeft, minutes: minutesLeft }
            });
        }

        user.coins += 100;
        user.nextRewardTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); 

        await user.save();

        return res.status(200).json({
            message: "You've received 100 free coins",
            coins: user.coins,
            nextRewardTime: user.nextRewardTime
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "A problem with claiming award occured on the server"});
    }
}

export async function rewardInfo(req, res) {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({
            username: user.username,
            coins: user.coins,
            nextRewardTime: user.nextRewardTime
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "A problem with getting reward-info occured on the server"});
    }
}