# API for Developers

CS2 Inventory Simulator exposes a couple of endpoints to be used in other applications.

## Get user inventory

```http
GET https://inventory.cstrike.app/api/inventory/{steamID64}.json
```

### Response

- Returns `200` (`application/json`):

  ```typescript
  type GetUserInventoryResponse = {
    caseid?: number;
    equipped?: boolean;
    equippedCT?: boolean;
    equippedT?: boolean;
    id: number;
    nametag?: string;
    seed?: number;
    stattrak?: number;
    stickers?: number[];
    stickerswear?: number[];
    storage?: CS_BaseInventoryItem[];
    uid: number;
    updatedat?: number;
    wear?: number;
  }[];
  ```

## Get user equipped items

```http
GET https://inventory.cstrike.app/api/equipped/v3/{steamID64}.json
```

### Response

- Returns `200` (`application/json`):

  ```typescript
  interface BaseEconItem {
    def: number;
    paint: number;
    seed: number;
    wear: number;
  }
  interface WeaponEconItem extends BaseEconItem {
    legacy: boolean;
    nametag: string;
    stattrak: number;
    stickers: {
      def: number;
      slot: number;
      wear: number;
    }[];
    uid: number;
  }
  interface AgentItem {
    model: string;
    patches: number[];
    vofallback: boolean;
    vofemale: boolean;
    voprefix: string;
  }
  interface MusicKitItem {
    def: number;
    stattrak: number;
    uid: number;
  }
  type GetUserEquippedItemsResponse = {
    agents?: Record<number, AgentItem>;
    ctWeapons?: Record<number, WeaponEconItem>;
    gloves?: Record<number, BaseEconItem>;
    knives?: Record<number, WeaponEconItem>;
    musicKit?: MusicKitItem;
    pin?: number;
    tWeapons?: Record<number, WeaponEconItem>;
  };
  ```

## Increment item StatTrak

```http
POST https://inventory.cstrike.app/api/increment-item-stattrak
```

### Request

> [!IMPORTANT]  
> API key must have `api` or `stattrak_increment` scope.

```typescript
type PostIncrementItemStatTrakRequest = {
  apiKey: string;
  targetUid: number;
  userId: string;
};
```

### Response

- Returns `401` when using an invalid API key.
- Returns `400` when the user does not exist or target uid is invalid.
- Returns `204` when the increment was successful.

## Sign-in user

This is intended to be used in other first-party apps to authenticate users to Inventory Simulator. First, a POST request must be sent to `/api/sign-in` to get the user's authentication `token`, then the user must be immediately redirected to `/api/sign-in/callback?token={token}`.

### Get user sign-in token

```http
POST https://inventory.cstrike.app/api/sign-in
```

#### Request

> [!IMPORTANT]  
> API key must have `api` or `api_auth` scope.

```typescript
type GetUserSignInTokenRequest = {
  apiKey: string;
  userId: string;
};
```

#### Response

- Returns `401` when using an invalid API key.
- Returns `400` when the user does not exist.
- Returns `200` (`application/json`) when a token is generated:

  ```typescript
  type GetUserSignInTokenResponse = {
    token: string; // expires in 1 minute.
  };
  ```

### Sign-in user

```http
GET https://inventory.cstrike.app/api/sign-in/callback?token={token}
```

#### Response

- Returns `302` redirecting to `https://inventory.cstrike.app/api/action/preferences` if the authentication was successful, otherwise to `https://inventory.cstrike.app`.
