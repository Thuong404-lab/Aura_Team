import React from 'react';

/**
 * Traditional Vietnamese Royal Cloud Motifs (Vân Mây Cổ Phong Hoàng Triều)
 * Accurately adapted from classical imperial art & the user's reference motifs:
 * 1. Hoàng Kim Tường Vân (Golden Swirl Auspicious Cloud)
 * 2. Hỏa Vân Chu Sa (Cinnabar Flame Cloud)
 * 3. Bạch Ngọc Như Ý (Ivory Pearl Cloud)
 * 4. Huyền Vũ Thủy Ba (Indigo Wave Cloud)
 * 5. Trường Vân Dải Lụa (Elongated Golden Streamer Cloud)
 * 6. Mây Cánh Én Cung Đình (Winged Imperial Cloud)
 */

interface CloudProps {
  className?: string;
  style?: React.CSSProperties;
  flipX?: boolean;
  opacity?: number;
}

// 1. Hoàng Kim Tường Vân (Golden Auspicious Swirl Cloud)
export const RoyalGoldenSwirlCloud: React.FC<CloudProps> = ({
  className = 'w-64 h-36',
  style,
  flipX = false,
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 320 180"
    className={`select-none pointer-events-none drop-shadow-lg ${className}`}
    style={{
      ...style,
      transform: `${style?.transform || ''} ${flipX ? 'scaleX(-1)' : ''}`,
      opacity,
    }}
    fill="none"
  >
    <defs>
      <linearGradient id="goldSwirlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF8D6" />
        <stop offset="25%" stopColor="#F5D061" />
        <stop offset="70%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8A6623" />
      </linearGradient>
      <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFECA8" />
        <stop offset="50%" stopColor="#E5B942" />
        <stop offset="100%" stopColor="#6C480E" />
      </linearGradient>
      <filter id="goldCloudGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Cloud Body Silhouette with graceful lobes */}
    <path
      d="M50 120 C30 120 15 105 18 85 C20 68 35 55 52 58 C55 38 75 22 98 25 C118 28 132 42 138 58 C152 42 178 38 198 48 C218 58 225 78 220 95 C238 90 260 98 270 115 C280 132 272 150 252 155 C232 160 190 155 160 148 C130 142 90 150 65 142 C52 138 48 128 50 120 Z"
      fill="url(#goldSwirlGrad)"
      stroke="url(#goldBorderGrad)"
      strokeWidth="3.5"
      strokeLinejoin="round"
      filter="url(#goldCloudGlow)"
    />

    {/* Stylized Imperial Swirl 1 (Left Lobe) */}
    <path
      d="M48 95 C55 82 72 82 80 92 C86 100 82 112 70 114 C60 115 54 105 60 98 C65 92 72 95 72 100"
      stroke="#6C480E"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Stylized Imperial Swirl 2 (Center Top Peak) */}
    <path
      d="M105 50 C120 40 142 45 148 60 C152 72 140 85 125 82 C112 80 108 68 116 60 C122 55 132 58 130 66"
      stroke="#6C480E"
      strokeWidth="2.4"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Stylized Imperial Swirl 3 (Right Center) */}
    <path
      d="M175 75 C190 65 212 70 218 86 C222 98 210 112 195 110 C182 108 178 96 186 88 C192 82 202 86 200 94"
      stroke="#6C480E"
      strokeWidth="2.4"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Right Swirling Tail Whisk (Đuôi mây lượn sóng) */}
    <path
      d="M260 130 C280 125 305 130 312 142 C318 152 308 162 292 160 C278 158 274 146 284 140 C290 136 298 138 296 144"
      stroke="url(#goldBorderGrad)"
      strokeWidth="2.8"
      strokeLinecap="round"
      fill="none"
    />

    {/* Accent highlights */}
    <path
      d="M80 32 C95 28 115 32 125 40"
      stroke="#FFF8D6"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path
      d="M170 48 C185 45 200 50 210 60"
      stroke="#FFF8D6"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.9"
    />
  </svg>
);

// 2. Hỏa Vân Chu Sa (Vermillion Cinnabar Flame Cloud - top right & row 3 right in user's image)
export const CinnabarFireCloud: React.FC<CloudProps> = ({
  className = 'w-64 h-36',
  style,
  flipX = false,
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 320 180"
    className={`select-none pointer-events-none drop-shadow-xl ${className}`}
    style={{
      ...style,
      transform: `${style?.transform || ''} ${flipX ? 'scaleX(-1)' : ''}`,
      opacity,
    }}
    fill="none"
  >
    <defs>
      <linearGradient id="cinnabarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFA048" />
        <stop offset="35%" stopColor="#E65100" />
        <stop offset="75%" stopColor="#C2185B" />
        <stop offset="100%" stopColor="#880E4F" />
      </linearGradient>
      <linearGradient id="cinnabarBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="60%" stopColor="#FF6D00" />
        <stop offset="100%" stopColor="#4A148C" />
      </linearGradient>
    </defs>

    {/* Fiery billowing cloud path */}
    <path
      d="M30 110 C15 95 20 70 42 62 C48 40 72 25 96 30 C118 35 130 52 135 68 C155 52 188 50 208 65 C228 80 230 102 218 120 C238 115 262 122 272 138 C282 155 268 170 245 168 C215 165 170 152 130 155 C90 158 50 162 38 140 C32 128 28 118 30 110 Z"
      fill="url(#cinnabarGrad)"
      stroke="url(#cinnabarBorder)"
      strokeWidth="3.2"
    />

    {/* Swirls with golden fire tongues */}
    <path
      d="M50 85 C62 70 85 75 90 92 C94 105 80 118 65 114 C52 110 50 96 60 88 C68 82 76 86 74 94"
      stroke="#FFE082"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M125 58 C142 45 168 52 172 72 C175 88 158 102 140 98 C125 94 122 78 132 70 C140 62 150 68 148 76"
      stroke="#FFE082"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M205 90 C220 80 242 85 245 102 C248 115 235 128 220 125 C208 122 205 110 212 102 C218 96 226 100 224 106"
      stroke="#FFE082"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Long curling flame tongue (Cuộn sóng mây lửa) */}
    <path
      d="M260 125 C282 110 310 115 315 130 C320 145 305 158 288 152 C275 148 272 135 282 128 C288 122 298 126 295 132"
      stroke="#FFD54F"
      strokeWidth="2.4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// 3. Bạch Ngọc Như Ý (Ivory Pearl Auspicious Cloud - row 2 right in user's image)
export const IvoryRuyiCloud: React.FC<CloudProps> = ({
  className = 'w-64 h-36',
  style,
  flipX = false,
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 320 180"
    className={`select-none pointer-events-none drop-shadow-xl ${className}`}
    style={{
      ...style,
      transform: `${style?.transform || ''} ${flipX ? 'scaleX(-1)' : ''}`,
      opacity,
    }}
    fill="none"
  >
    <defs>
      <linearGradient id="ivoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#FFFDF0" />
        <stop offset="70%" stopColor="#F5ECCE" />
        <stop offset="100%" stopColor="#E2D0A5" />
      </linearGradient>
      <linearGradient id="ivoryGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#A0792C" />
      </linearGradient>
    </defs>

    {/* Cloud body */}
    <path
      d="M45 110 C25 105 18 80 35 65 C48 52 70 48 85 58 C95 38 122 25 148 32 C172 38 185 58 188 75 C205 65 232 68 245 85 C258 102 250 125 232 135 C248 142 252 160 238 170 C220 178 180 168 145 165 C110 162 70 172 45 155 C35 145 38 125 45 110 Z"
      fill="url(#ivoryGrad)"
      stroke="url(#ivoryGoldBorder)"
      strokeWidth="3.2"
    />

    {/* Delicate concentric spirals (Chỉ vàng xoắn ốc) */}
    <path
      d="M75 75 C90 62 112 68 115 85 C118 98 105 110 90 108 C78 105 75 92 84 85 C90 80 98 84 96 90"
      stroke="#D4AF37"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M140 50 C160 38 185 45 190 65 C195 82 178 98 160 94 C145 90 140 75 150 68 C158 60 168 66 166 74"
      stroke="#D4AF37"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M195 95 C210 85 232 90 235 106 C238 120 224 132 208 128 C195 125 192 112 200 105 C206 100 214 104 212 110"
      stroke="#D4AF37"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M100 120 C115 112 132 118 135 130 C138 140 128 148 118 145 C110 142 108 132 114 128"
      stroke="#D4AF37"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 4. Huyền Vũ Thủy Ba (Indigo Sapphire Royal Cloud - bottom left in user's image)
export const IndigoWaveCloud: React.FC<CloudProps> = ({
  className = 'w-64 h-36',
  style,
  flipX = false,
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 320 180"
    className={`select-none pointer-events-none drop-shadow-xl ${className}`}
    style={{
      ...style,
      transform: `${style?.transform || ''} ${flipX ? 'scaleX(-1)' : ''}`,
      opacity,
    }}
    fill="none"
  >
    <defs>
      <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#385F8A" />
        <stop offset="40%" stopColor="#1E3A5F" />
        <stop offset="85%" stopColor="#0F2038" />
        <stop offset="100%" stopColor="#08101D" />
      </linearGradient>
      <linearGradient id="indigoGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="50%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#D4AF37" />
      </linearGradient>
    </defs>

    {/* Cloud body with multi-wave scallops */}
    <path
      d="M30 125 C15 112 20 85 45 75 C42 55 65 38 88 42 C110 46 122 62 128 78 C145 62 175 60 195 75 C215 90 215 112 202 128 C222 125 245 135 250 152 C255 168 238 180 215 178 C180 175 140 162 100 168 C65 172 38 155 30 125 Z"
      fill="url(#indigoGrad)"
      stroke="url(#indigoGoldBorder)"
      strokeWidth="3.2"
    />

    {/* Water-wave scales pattern inside (Vảy thủy ba) */}
    <g stroke="rgba(147, 197, 253, 0.45)" strokeWidth="1.8" fill="none">
      <path d="M55 95 Q65 85 75 95 Q85 85 95 95 Q105 85 115 95" />
      <path d="M65 110 Q75 100 85 110 Q95 100 105 110 Q115 100 125 110" />
      <path d="M125 80 Q135 70 145 80 Q155 70 165 80 Q175 70 185 80" />
      <path d="M135 95 Q145 85 155 95 Q165 85 175 95 Q185 85 195 95" />
      <path d="M75 130 Q90 118 105 130 Q120 118 135 130 Q150 118 165 130" />
    </g>

    {/* Long trailing wave tail (Đuôi mây lượn sóng) */}
    <path
      d="M240 145 C265 138 290 148 300 160 C308 170 295 180 280 178 C265 175 260 162 272 155"
      stroke="url(#indigoGoldBorder)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// 5. Trường Vân Dải Lụa (Elongated Golden Streamer Ribbon Cloud - top left & bottom right in user's image)
export const StreamerWispsCloud: React.FC<CloudProps> = ({
  className = 'w-96 h-28',
  style,
  flipX = false,
  opacity = 0.9,
}) => (
  <svg
    viewBox="0 0 450 120"
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
    style={{
      ...style,
      transform: `${style?.transform || ''} ${flipX ? 'scaleX(-1)' : ''}`,
      opacity,
    }}
    fill="none"
  >
    <defs>
      <linearGradient id="streamerGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFECA8" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.85" />
        <stop offset="80%" stopColor="#AA771C" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
      </linearGradient>
    </defs>

    {/* Ribbon Streamer 1 */}
    <path
      d="M10 50 C40 30 85 40 120 28 C160 15 200 45 250 35 C300 25 350 48 400 38 C420 34 438 42 445 52 C448 58 442 66 432 64 C418 62 415 50 425 45 C430 42 438 46 435 50"
      stroke="url(#streamerGold)"
      strokeWidth="3.2"
      strokeLinecap="round"
    />

    {/* Ribbon Streamer 2 (Interlacing Echo) */}
    <path
      d="M30 75 C70 58 115 68 150 55 C195 40 235 72 280 62 C325 52 370 78 410 65 C425 60 435 68 440 76"
      stroke="url(#streamerGold)"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Ribbon Streamer 3 (Lower Flow) */}
    <path
      d="M60 95 C110 82 150 92 190 80 C235 68 275 95 320 85 C365 75 400 95 430 88"
      stroke="url(#streamerGold)"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.65"
    />

    {/* Trailing Tail Spiral */}
    <path
      d="M15 50 C5 48 0 58 5 65 C12 72 24 66 22 56 C20 48 12 50 14 55"
      stroke="url(#streamerGold)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// 6. Mây Cánh Én Cung Đình (Winged Imperial Pagoda Cloud - image 2 center)
export const WingedImperialCloud: React.FC<CloudProps> = ({
  className = 'w-64 h-32',
  style,
  flipX = false,
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 300 140"
    className={`select-none pointer-events-none drop-shadow-xl ${className}`}
    style={{
      ...style,
      transform: `${style?.transform || ''} ${flipX ? 'scaleX(-1)' : ''}`,
      opacity,
    }}
    fill="none"
  >
    <defs>
      <linearGradient id="wingedGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF1B8" />
        <stop offset="30%" stopColor="#E5B942" />
        <stop offset="70%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7E5616" />
      </linearGradient>
    </defs>

    {/* Symmetrical / Winged Silhouette */}
    <path
      d="M20 70 C40 68 60 52 75 60 C90 40 120 30 150 35 C180 30 210 40 225 60 C240 52 260 68 280 70 C295 72 275 88 250 82 C230 100 200 115 150 112 C100 115 70 100 50 82 C25 88 5 72 20 70 Z"
      fill="url(#wingedGoldGrad)"
      stroke="#5A3A0A"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />

    {/* Center Swirl */}
    <path
      d="M135 60 C145 50 162 52 165 65 C168 76 156 86 145 84 C136 82 134 72 140 68 C145 64 152 66 150 72"
      stroke="#5A3A0A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Left Wing Swirl */}
    <path
      d="M75 68 C85 60 98 64 100 74 C102 82 94 90 85 88 C78 86 76 78 82 74"
      stroke="#5A3A0A"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Right Wing Swirl */}
    <path
      d="M225 68 C215 60 202 64 200 74 C198 82 206 90 215 88 C222 86 224 78 218 74"
      stroke="#5A3A0A"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
