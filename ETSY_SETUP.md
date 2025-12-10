# Etsy API Setup Instructies

## 🎯 Wat doet deze integratie?

Deze webshop haalt automatisch je product listings op van Etsy en toont ze in een mooie, geoptimaliseerde interface. Wanneer bezoekers op "Koop op Etsy" klikken, worden ze doorgeleid naar jouw Etsy shop voor een veilige betaling.

**Voordelen:**
- ✅ Eén centrale plek voor producten (Etsy)
- ✅ Automatische sync van prijzen en voorraad
- ✅ Etsy's betrouwbare betaalsysteem
- ✅ Eigen branding op je website
- ✅ SEO voordelen met eigen domein

## 📋 Stap 1: Etsy Shop ID ophalen ✅ VOLTOOID

**Je Shop ID: `63450436`** 🎉

Dit is succesvol opgehaald uit je Etsy Shop Manager dashboard en is al geconfigureerd in `.env.local`!

### Hoe we het hebben gevonden:

Je Shop ID stond in de HTML van je Shop Manager dashboard:
```html
data-referring_type="shop"
data-referring_id="63450436"
```

### Voor referentie: Andere methodes om Shop ID te vinden

1. **Via je Etsy Shop URL** (als je het ooit opnieuw nodig hebt):
   - Ga naar je Shop Manager
   - Kijk naar de URL: `https://www.etsy.com/your/shops/JOUW_SHOP_ID/dashboard`
   - Het getal na `/shops/` is je Shop ID!

### Alternatieve Methode: Via Etsy API

Als je je **shop naam** weet (bijv. "LaNinaBracelets"):

1. Open deze URL in je browser (vervang JOUWSHOPNAAM):
   ```
   https://api.etsy.com/v3/application/shops?shop_name=JOUWSHOPNAAM
   ```
   
2. Voeg je API key toe als header (kan via Postman of een browser extension)

3. Of gebruik deze tijdelijke test pagina (ik maak deze voor je)

### 🚀 Snelste Methode: Gebruik ons Helper Script

Ik heb een helper script gemaakt dat automatisch je Shop ID ophaalt:

```bash
node scripts/get-shop-id.js JOUWSHOPNAAM
```

**Voorbeeld:**
```bash
node scripts/get-shop-id.js LaNinaBracelets
```

Het script toont:
- ✅ Shop ID
- 📊 Shop details
- 📝 Klaar om te copy-pasten naar .env.local

**Wat je shop naam is:**
- Kijk in je Etsy shop URL: `etsy.com/shop/SHOPNAAM`
- Of in je Shop Manager onder "Shop Settings"

## 🔑 Stap 2: Environment Variables instellen ✅ VOLTOOID

**Je credentials zijn geconfigureerd:**
- ✅ **API Key (Keystring)**: `rg4tmn3xzesq2a5vczf0os1w`
- ✅ **Shared Secret**: `zws4h3pm4j`
- ✅ **Shop ID**: `63450436`
- ⏳ **Status**: Pending Personal Approval

### Je `.env.local` bestand:

```env
# Etsy API Configuration
ETSY_API_KEY=rg4tmn3xzesq2a5vczf0os1w
ETSY_SHARED_SECRET=zws4h3pm4j
ETSY_SHOP_ID=63450436

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**✅ Dit is al geconfigureerd!** Je hoeft niets meer te doen.

**BELANGRIJK**: `.env.local` staat in `.gitignore` en wordt NOOIT gecommit naar git!

## ⏳ Stap 3: Wachten op API Goedkeuring

Je Etsy API app staat op **"Pending Personal Approval"**. Dit betekent:

### Wat je moet doen:
1. Ga naar [Etsy Developer Console](https://www.etsy.com/developers/your-apps)
2. Klik op je app "laninabraceletsapp"
3. Voltooi de app setup:
   - **App Purpose**: "Personal use for my shop website"
   - **OAuth Redirect URL**: `http://localhost:3000` (voor development)
   - Voor productie: `https://jouwdomein.com`

### Goedkeuring proces:
- **Personal apps** worden meestal binnen 24 uur goedgekeurd
- Je krijgt een email van Etsy zodra het is goedgekeurd
- Je kunt de API al testen terwijl je wacht op goedkeuring

## 🧪 Stap 4: Testen

### Development Server starten:
```bash
npm run dev
```

### Check of Etsy data wordt geladen:
1. Open http://localhost:3000
2. Check de console output:
   - ✅ `Loaded X products from Etsy` = Success!
   - ⚠️ `Using fallback product data` = Etsy API werkt nog niet

### Test de API direct:
```bash
# Test producten ophalen
curl http://localhost:3000/api/products

# Test shop info
curl http://localhost:3000/api/shop
```

## 🔍 Troubleshooting

### "Using fallback product data"
**Oorzaak**: Etsy API credentials zijn niet ingesteld of incorrect

**Oplossing**:
1. Check of `.env.local` bestaat
2. Check of de API key en Shop ID correct zijn
3. Restart de dev server (`npm run dev`)

### "Etsy API error: 401"
**Oorzaak**: API key is incorrect of nog niet goedgekeurd

**Oplossing**:
1. Wacht op Etsy goedkeuring
2. Check of je de juiste API key hebt ingevuld
3. Refresh je API credentials in Etsy Developer Console

### "Etsy API error: 403"
**Oorzaak**: Je app heeft geen toegang tot deze resource

**Oplossing**:
1. Check OAuth scopes in Etsy Developer Console
2. Zorg dat je app "listings_r" scope heeft

### "Etsy API error: 429"
**Oorzaak**: Rate limit overschreden (5 requests per seconde)

**Oplossing**:
- De app cached data voor 1 uur
- Bij development: refresh minder vaak
- Dit zou normaal niet moeten gebeuren

## 📊 Rate Limits

Jouw app heeft:
- **5 QPS** (Queries Per Second) - 5 requests per seconde
- **5K QPD** (Queries Per Day) - 5000 requests per dag

De app cached data automatisch:
- Producten: 1 uur cache
- Shop info: 24 uur cache

Dit is ruim voldoende voor een webshop!

## 🚀 Productie Deployment

### Voordat je live gaat:

1. **Update Etsy App settings**:
   - OAuth Redirect URL: `https://jouwdomein.com`
   - App URL: `https://jouwdomein.com`

2. **Set Environment Variables** op je hosting platform:
   ```
   ETSY_API_KEY=rg4tmn3xzesq2a5vczf0os1w
   ETSY_SHARED_SECRET=zws4h3pm4j
   ETSY_SHOP_ID=jouw_shop_id
   NEXT_PUBLIC_SITE_URL=https://jouwdomein.com
   ```

3. **Test je productie API**:
   ```bash
   curl https://jouwdomein.com/api/products
   ```

## 📱 Hoe het werkt voor bezoekers

1. Bezoeker komt op je website
2. Ziet je producten (opgehaald van Etsy)
3. Klikt op product voor details
4. Klikt op **"Koop op Etsy"** button
5. → Wordt doorgeleid naar Etsy product pagina
6. Betaalt via Etsy's checkout
7. Jij ontvangt de order via Etsy!

## 🛡️ Veiligheid

- ✅ API keys staan in `.env.local` (niet in git)
- ✅ Server-side API calls (keys niet zichtbaar in browser)
- ✅ Rate limiting door Next.js caching
- ✅ Secure HTTPS verbindingen

## 💡 Tips

### Producten updaten
- Update je producten in Etsy
- Website haalt automatisch nieuwe data op (max 1 uur vertraging door cache)
- Force refresh: herstart de Next.js server

### Custom producten toevoegen
Als je wilt mix je Etsy producten met custom producten in `/src/lib/data.ts`

### Affiliate commissie
Overweeg het [Etsy Affiliate Programma](https://www.etsy.com/affiliates) voor extra inkomsten!

## 📞 Support

- **Etsy API Documentatie**: https://developers.etsy.com/documentation
- **Etsy API Forum**: https://community.etsy.com/t5/Etsy-API/bd-p/etsy-api
- **Next.js Docs**: https://nextjs.org/docs

---

**Klaar om te starten?** 
1. Haal je Shop ID op
2. Vul `.env.local` in
3. Start `npm run dev`
4. Check of producten worden geladen! 🎉

