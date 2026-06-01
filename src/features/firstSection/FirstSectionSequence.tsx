import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  isEmilySupportReferenceConfigured,
  isEmilySupportSurfaceConfigured,
} from '@/config/externalSurfaces';
import { colors, radii, spacing, typography } from '@/theme';
import type { FirstSectionState } from '@/features/firstSection/types';

type FirstSectionSequenceProps = {
  state: FirstSectionState;
  caseNumber: string | null;
  onOpenEmilySupportSite: () => Promise<{ ok: true } | { ok: false; error: string }>;
  onSubmitEmilyReference: (reference: string) => { ok: true } | { ok: false; error: string };
  onSubmitCorrection: () => void;
  onActivateRadiant: () => void;
  onCloseSection: () => void;
};

function correctionRef(caseNumber: string | null) {
  const base = caseNumber ?? 'RBT-016-000000';
  return `${base}-C001`;
}

function RadiantFragment() {
  return (
    <View accessibilityLabel="A hand-drawn fragment" style={styles.fragment}>
      <View style={styles.fragmentGround} />
      <View style={styles.fragmentDoorLeft} />
      <View style={styles.fragmentDoorRight} />
      <View style={styles.fragmentLintel} />
      <View style={styles.fragmentLight} />
      <View style={styles.fragmentMark} />
    </View>
  );
}

export function FirstSectionSequence({
  state,
  caseNumber,
  onOpenEmilySupportSite,
  onSubmitEmilyReference,
  onSubmitCorrection,
  onActivateRadiant,
  onCloseSection,
}: FirstSectionSequenceProps) {
  const [referenceInput, setReferenceInput] = useState('');
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [openError, setOpenError] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const supportSurfaceReady = isEmilySupportSurfaceConfigured();
  const referenceConfirmationReady = isEmilySupportReferenceConfigured();

  if (!state.dispatch_001_completed) {
    return null;
  }

  const handleOpenSupportSource = async () => {
    setOpenError(null);
    setIsOpening(true);

    const result = await onOpenEmilySupportSite();

    setIsOpening(false);

    if (!result.ok) {
      setOpenError(result.error);
    }
  };

  const handleSubmitReference = () => {
    setReferenceError(null);

    if (!referenceConfirmationReady) {
      setReferenceError('Support reference confirmation is not connected to this receiver yet.');
      return;
    }

    const result = onSubmitEmilyReference(referenceInput);

    if (!result.ok) {
      setReferenceError(result.error);
      return;
    }

    setReferenceInput('');
  };

  return (
    <View style={styles.sequence}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Case file note</Text>
        <Text style={styles.body}>Dispatch 001 cites Emily Service.</Text>
        <Text style={styles.body}>Source: company support.</Text>
        {state.emily_site_opened ? (
          <Text style={styles.sentNote}>Support source opened.</Text>
        ) : supportSurfaceReady ? (
          <>
            <Pressable
              accessibilityRole="button"
              disabled={isOpening}
              onPress={handleOpenSupportSource}
              style={({ pressed }) => [
                styles.action,
                pressed || isOpening ? styles.actionPressed : null,
              ]}
            >
              <Text style={styles.actionText}>
                {isOpening ? 'Opening' : 'Open support source'}
              </Text>
            </Pressable>
            {openError ? <Text style={styles.inlineError}>{openError}</Text> : null}
          </>
        ) : (
          <Text style={styles.pendingNote}>
            Support source not connected to this receiver.
          </Text>
        )}
      </View>

      {state.emily_site_opened && !state.emily_reference_submitted ? (
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Support reference</Text>
          <Text style={styles.body}>Enter the reference from the support page.</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={referenceConfirmationReady}
            onChangeText={(value) => {
              setReferenceInput(value);
              setReferenceError(null);
            }}
            placeholder="Reference"
            placeholderTextColor={colors.textFaint}
            spellCheck={false}
            style={[styles.input, !referenceConfirmationReady ? styles.inputPending : null]}
            value={referenceInput}
          />
          {referenceConfirmationReady ? (
            <Pressable
              accessibilityRole="button"
              onPress={handleSubmitReference}
              style={({ pressed }) => [styles.action, pressed ? styles.actionPressed : null]}
            >
              <Text style={styles.actionText}>Continue</Text>
            </Pressable>
          ) : (
            <Text style={styles.pendingNote}>
              Reference confirmation not connected to this receiver.
            </Text>
          )}
          {referenceError ? <Text style={styles.inlineError}>{referenceError}</Text> : null}
        </View>
      ) : null}

      {state.emily_reference_submitted ? (
        <View style={styles.receiptCard}>
          <Text style={styles.eyebrow}>Support reference</Text>
          <Text style={styles.receiptWord}>NOTED</Text>
          <Text style={styles.body}>Reference noted.</Text>
        </View>
      ) : null}

      {state.emily_contact_attempted ? (
        <View style={styles.youCard}>
          <Text style={styles.youEyebrow}>You</Text>
          <Text style={styles.body}>
            There&rsquo;s a notice on file 004773 that I didn&rsquo;t add. Can you take it off?
          </Text>
        </View>
      ) : null}

      {state.emily_reply_001_received ? (
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Emily &middot; Technical Support</Text>
          <Text style={styles.body}>
            Hi &mdash; thanks for the note. I can see the notice on your file, but not the reason it
            attached. That&rsquo;s a little unusual, honestly.
          </Text>
          <Text style={styles.body}>
            I&rsquo;ve filed a correction from my side. If it&rsquo;s still there after your next
            sync, write me back and I&rsquo;ll push it up the chain.
          </Text>
          <Text style={styles.signoff}>&mdash; Emily</Text>
          {state.correction_request_submitted ? null : (
            <Pressable
              accessibilityRole="button"
              onPress={onSubmitCorrection}
              style={({ pressed }) => [styles.action, pressed ? styles.actionPressed : null]}
            >
              <Text style={styles.actionText}>File the correction</Text>
            </Pressable>
          )}
        </View>
      ) : null}

      {state.correction_request_submitted ? (
        <View style={styles.receiptCard}>
          <Text style={styles.eyebrow}>Filed</Text>
          <Text style={styles.receiptWord}>NOTED</Text>
          <Text style={styles.receiptRef}>REF {correctionRef(caseNumber)}</Text>
          <Text style={styles.body}>
            Something came attached to the correction that you didn&rsquo;t send.
          </Text>
          {state.radiant_l1_active ? null : (
            <Pressable
              accessibilityRole="button"
              onPress={onActivateRadiant}
              style={({ pressed }) => [styles.action, pressed ? styles.actionPressed : null]}
            >
              <Text style={styles.actionText}>Open it</Text>
            </Pressable>
          )}
        </View>
      ) : null}

      {state.radiant_l1_active ? (
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Attachment</Text>
          <RadiantFragment />
          <Text style={styles.body}>
            A drawing, done by hand. A street corner, a doorway, the way the late light sits there.
          </Text>
          <Text style={styles.body}>You don&rsquo;t know the hand. You know the place.</Text>
          {state.first_section_closed ? null : (
            <Pressable
              accessibilityRole="button"
              onPress={onCloseSection}
              style={({ pressed }) => [styles.action, pressed ? styles.actionPressed : null]}
            >
              <Text style={styles.actionText}>Set it down</Text>
            </Pressable>
          )}
        </View>
      ) : null}

      {state.first_section_closed ? (
        <>
          <View style={styles.quietCard}>
            <Text style={styles.quietBody}>A record surfaced. The line changed.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.eyebrow}>Signal</Text>
            <Text style={styles.cardTitle}>A new signal arrived</Text>
            <Text style={styles.body}>Hold the line. It will come through.</Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sequence: {
    gap: spacing.lg,
  },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
  },
  eyebrow: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  signoff: {
    color: colors.textFaint,
    fontSize: typography.small,
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.signalMuted,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
  actionPressed: {
    opacity: 0.6,
  },
  actionText: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  sentNote: {
    marginTop: spacing.xs,
    color: colors.textFaint,
    fontSize: typography.small,
    lineHeight: 21,
  },
  pendingNote: {
    marginTop: spacing.xs,
    color: colors.textFaint,
    fontSize: typography.small,
    lineHeight: 21,
  },
  inlineError: {
    color: colors.signal,
    fontSize: typography.small,
    lineHeight: 21,
  },
  input: {
    marginTop: spacing.xs,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radii.sm,
    backgroundColor: colors.veil,
    color: colors.text,
    fontSize: typography.body,
  },
  inputPending: {
    opacity: 0.6,
  },
  youCard: {
    gap: spacing.xs,
    padding: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.borderSoft,
    backgroundColor: colors.veil,
    borderRadius: radii.sm,
  },
  youEyebrow: {
    color: colors.textFaint,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  receiptCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radii.lg,
    backgroundColor: colors.veil,
  },
  receiptWord: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
    letterSpacing: 4,
  },
  receiptRef: {
    color: colors.signal,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.4,
    fontVariant: ['tabular-nums'],
  },
  quietCard: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  quietBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 26,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  fragment: {
    height: 168,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radii.md,
    backgroundColor: colors.veil,
    overflow: 'hidden',
    position: 'relative',
  },
  fragmentGround: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: 44,
    height: 1,
    backgroundColor: colors.signal,
    opacity: 0.4,
  },
  fragmentDoorLeft: {
    position: 'absolute',
    left: 78,
    bottom: 44,
    width: 1,
    height: 78,
    backgroundColor: colors.signal,
    opacity: 0.42,
  },
  fragmentDoorRight: {
    position: 'absolute',
    left: 132,
    bottom: 44,
    width: 1,
    height: 78,
    backgroundColor: colors.signal,
    opacity: 0.42,
  },
  fragmentLintel: {
    position: 'absolute',
    left: 78,
    width: 55,
    top: 46,
    height: 1,
    backgroundColor: colors.signal,
    opacity: 0.42,
  },
  fragmentLight: {
    position: 'absolute',
    right: 40,
    top: 28,
    width: 120,
    height: 1,
    backgroundColor: colors.accent,
    opacity: 0.28,
    transform: [{ rotate: '34deg' }],
  },
  fragmentMark: {
    position: 'absolute',
    left: 150,
    bottom: 30,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.accent,
    opacity: 0.4,
  },
});
