import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Colors } from "@/constants/theme";

interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

export function DonutChart({
  segments,
  size = 140,
  strokeWidth = 18,
  centerLabel = "total",
  centerValue,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;

  let accumulated = 0;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ position: "relative", width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={Colors.border.light}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Segments */}
          <G rotation="-90" origin={`${cx}, ${cy}`}>
            {segments.map((segment, i) => {
              const pct = total > 0 ? segment.value / total : 0;
              const dashLength = pct * circumference;
              const dashOffset = accumulated * circumference;
              accumulated += pct;

              if (segment.value === 0) return null;

              return (
                <Circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={-dashOffset}
                  strokeLinecap="round"
                  fill="none"
                />
              );
            })}
          </G>
        </Svg>
        {/* Center text */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontFamily: "Inter_800ExtraBold",
              color: Colors.text.DEFAULT,
              letterSpacing: -0.5,
            }}
          >
            {centerValue ?? total}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Inter_400Regular",
              color: Colors.text.muted,
              marginTop: -2,
            }}
          >
            {centerLabel}
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View style={{ marginLeft: 20, flex: 1 }}>
        {segments.map((segment, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: i < segments.length - 1 ? 8 : 0,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: segment.color,
              }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: Colors.text.secondary,
                marginLeft: 8,
              }}
              numberOfLines={1}
            >
              {segment.label}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter_700Bold",
                color: Colors.text.DEFAULT,
                marginLeft: 8,
              }}
            >
              {segment.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
