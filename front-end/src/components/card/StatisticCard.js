import { Card, Statistic, Progress } from "antd";

const StatisticCard = ({
                           title,
                           value,
                           total,
                           color,
                           prefix,
                           onClick,
                       }) => {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div style={{ cursor: "pointer" }} onClick={() => onClick?.(value)}>
            <Card>
                <Statistic title={title} value={value} valueStyle={{ color }} prefix={prefix} />
                <div style={{ marginTop: 8 }}>
                    <Progress percent={percent} size="small" strokeColor={color} />
                </div>
            </Card>
        </div>
    );
};

export default StatisticCard;
